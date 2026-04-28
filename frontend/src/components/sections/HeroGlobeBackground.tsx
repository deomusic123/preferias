"use client";

import {
  geoGraticule10,
  geoInterpolate,
  geoOrthographic,
  geoPath,
  type GeoProjection,
} from "d3-geo";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import { MAP_NODES } from "@/lib/constants";

const WORLD_ATLAS_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const TAU = Math.PI * 2;

type GeographicPoint = [number, number];
type RouteSegment = readonly [GeographicPoint, GeographicPoint];
type LandFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>;

const SURFACE_POINTS: GeographicPoint[] = (() => {
  const points: GeographicPoint[] = [];

  for (let latitude = -85; latitude <= 85; latitude += 5) {
    for (let longitude = -180; longitude <= 180; longitude += 5) {
      points.push([longitude, latitude]);
    }
  }

  return points;
})();

const ROUTE_SEGMENTS: RouteSegment[] = MAP_NODES.slice(0, -1).map((node, index) => {
  return [node.coordinates, MAP_NODES[index + 1]!.coordinates] as const;
});

type HeroGlobeBackgroundProps = {
  className?: string;
};

function traceRouteSegment(
  projection: GeoProjection,
  context: CanvasRenderingContext2D,
  start: GeographicPoint,
  end: GeographicPoint,
  startRatio: number,
  endRatio: number,
): boolean {
  const interpolator = geoInterpolate(start, end);
  const steps = 42;
  let traced = false;

  for (let step = 0; step <= steps; step += 1) {
    const ratio = startRatio + ((endRatio - startRatio) * step) / steps;
    const projected = projection(interpolator(ratio));

    if (!projected) {
      continue;
    }

    const [x, y] = projected;

    if (!traced) {
      context.moveTo(x, y);
      traced = true;
      continue;
    }

    context.lineTo(x, y);
  }

  return traced;
}

export function HeroGlobeBackground({ className }: HeroGlobeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const projection = geoOrthographic().clipAngle(90).precision(0.35);
    const path = geoPath(projection, context);
    const graticule = geoGraticule10();

    let width = 0;
    let height = 0;
    let landData: LandFeatureCollection | null = null;
    let animationFrame = 0;
    let mounted = true;

    const resizeCanvas = (): void => {
      const rect = container.getBoundingClientRect();

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      const devicePixelRatio = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const drawScene = (time: number): void => {
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.56;
      const centerY = height * 0.56;
      const globeRadius = Math.min(width, height) * 0.42;
      const horizontalRotation = 60 + Math.sin(time * 0.00008) * 4.2;
      const verticalRotation = 24 + Math.sin(time * 0.00006) * 1.8;

      projection
        .translate([centerX, centerY])
        .scale(globeRadius)
        .rotate([horizontalRotation, verticalRotation, 0]);

      const ambientGlow = context.createRadialGradient(
        centerX,
        centerY,
        globeRadius * 0.26,
        centerX,
        centerY,
        globeRadius * 1.32,
      );
      ambientGlow.addColorStop(0, "rgba(0, 229, 255, 0.16)");
      ambientGlow.addColorStop(0.58, "rgba(24, 122, 170, 0.08)");
      ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      context.beginPath();
      context.fillStyle = ambientGlow;
      context.arc(centerX, centerY, globeRadius * 1.35, 0, TAU);
      context.fill();

      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = "rgba(7, 16, 33, 0.94)";
      context.fill();
      context.strokeStyle = "rgba(84, 117, 173, 0.45)";
      context.lineWidth = 1;
      context.stroke();

      context.beginPath();
      path(graticule);
      context.strokeStyle = "rgba(73, 102, 150, 0.26)";
      context.lineWidth = 0.55;
      context.stroke();

      for (const point of SURFACE_POINTS) {
        const projected = projection(point);

        if (!projected) {
          continue;
        }

        const [x, y] = projected;
        const distanceFromCenter = Math.hypot(x - centerX, y - centerY) / globeRadius;
        const opacity = Math.max(0.07, 0.34 * (1 - distanceFromCenter));
        const radius = distanceFromCenter < 0.72 ? 1 : 0.78;

        context.beginPath();
        context.fillStyle = `rgba(185, 214, 245, ${opacity.toFixed(3)})`;
        context.arc(x, y, radius, 0, TAU);
        context.fill();
      }

      if (landData) {
        context.beginPath();
        path(landData);
        context.fillStyle = "rgba(18, 39, 71, 0.52)";
        context.fill();
        context.strokeStyle = "rgba(83, 120, 176, 0.56)";
        context.lineWidth = 0.58;
        context.stroke();
      }

      for (const segment of ROUTE_SEGMENTS) {
        context.beginPath();
        const traced = traceRouteSegment(projection, context, segment[0], segment[1], 0, 1);

        if (!traced) {
          continue;
        }

        context.setLineDash([3, 4]);
        context.strokeStyle = "rgba(0, 188, 255, 0.3)";
        context.lineWidth = 1.05;
        context.stroke();
        context.setLineDash([]);
      }

      ROUTE_SEGMENTS.forEach((segment, segmentIndex) => {
        const pulseHead = (time * 0.000145 + segmentIndex * 0.19) % 1;
        const pulseTail = Math.max(0, pulseHead - 0.2);

        context.beginPath();
        const traced = traceRouteSegment(
          projection,
          context,
          segment[0],
          segment[1],
          pulseTail,
          pulseHead,
        );

        if (!traced) {
          return;
        }

        context.strokeStyle = "rgba(0, 229, 255, 0.92)";
        context.lineWidth = 1.85;
        context.stroke();
      });

      const activeNodeIndex = Math.floor((time / 2800) % MAP_NODES.length);

      MAP_NODES.forEach((node, index) => {
        const projected = projection(node.coordinates);

        if (!projected) {
          return;
        }

        const [x, y] = projected;
        const isActive = index === activeNodeIndex;
        const pulseRadius = isActive ? 5 + Math.sin(time * 0.01) * 1.2 : 2.8;

        context.beginPath();
        context.fillStyle = isActive ? "rgba(0, 229, 255, 0.34)" : "rgba(101, 130, 176, 0.26)";
        context.arc(x, y, pulseRadius, 0, TAU);
        context.fill();

        context.beginPath();
        context.fillStyle = isActive ? "#00E5FF" : "#A8BBD8";
        context.arc(x, y, isActive ? 2.75 : 1.9, 0, TAU);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(drawScene);
    };

    const loadLandData = async (): Promise<void> => {
      try {
        const response = await fetch(WORLD_ATLAS_URL);

        if (!response.ok) {
          return;
        }

        const topology = (await response.json()) as {
          objects?: {
            countries?: unknown;
          };
        };

        if (!mounted || !topology.objects?.countries) {
          return;
        }

        const geoResult = feature(
          topology as never,
          topology.objects.countries as never,
        ) as unknown;

        if (!geoResult || typeof geoResult !== "object" || !("type" in geoResult)) {
          return;
        }

        if ((geoResult as GeoJSON.GeoJsonObject).type === "FeatureCollection") {
          landData = geoResult as LandFeatureCollection;
          return;
        }

        if ((geoResult as GeoJSON.GeoJsonObject).type === "Feature") {
          landData = {
            type: "FeatureCollection",
            features: [
              geoResult as GeoJSON.Feature<
                GeoJSON.Geometry,
                GeoJSON.GeoJsonProperties
              >,
            ],
          };
        }
      } catch {
        landData = null;
      }
    };

    resizeCanvas();

    const observer = new ResizeObserver(() => {
      resizeCanvas();
    });

    observer.observe(container);

    void loadLandData();

    animationFrame = window.requestAnimationFrame(drawScene);

    return () => {
      mounted = false;
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
