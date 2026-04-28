"use client";

import { MapPin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { MAP_GEO_URL, MAP_NODES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type GeographyShape = {
  rsmKey: string;
  properties?: {
    name?: string;
    NAME?: string;
    ADMIN?: string;
  };
};

const TARGET_COUNTRIES = new Set(["Argentina", "Chile"]);
const DEFAULT_CENTER: [number, number] = [-64.8, -34.6];
const DEFAULT_SCALE = 1100;
const HUD_LINE_STROKE = "#00E5FF";
const ROUTE_LINE_STROKE = "#3E4A62";

type ConnectorLine = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function subscribeToClientStatus(): () => void {
  return () => {};
}

function getGeographyName(geo: GeographyShape): string {
  return geo.properties?.name ?? geo.properties?.NAME ?? geo.properties?.ADMIN ?? "";
}

export default function InteractiveMapSection() {
  const isClient = useSyncExternalStore(subscribeToClientStatus, () => true, () => false);

  const timelineNodes = useMemo(() => MAP_NODES, []);
  const [activeNodeId, setActiveNodeId] = useState<string>(timelineNodes[0]?.id ?? "");
  const [connectorLine, setConnectorLine] = useState<ConnectorLine | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Record<string, SVGGElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const activeNodeIndex = useMemo(
    () => timelineNodes.findIndex((node) => node.id === activeNodeId),
    [activeNodeId, timelineNodes],
  );

  const activateNode = (nodeId: string): void => {
    setActiveNodeId(nodeId);
  };

  const isMapReady = isClient && timelineNodes.length > 0;

  const updateConnectorLine = useCallback((): void => {
    if (!isMapReady) {
      setConnectorLine(null);
      return;
    }

    const gridElement = gridRef.current;
    const markerElement = markerRefs.current[activeNodeId];
    const cardElement = cardRefs.current[activeNodeId];

    if (!gridElement || !markerElement || !cardElement) {
      setConnectorLine(null);
      return;
    }

    const gridRect = gridElement.getBoundingClientRect();
    const markerRect = markerElement.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    setConnectorLine({
      x1: markerRect.left + markerRect.width / 2 - gridRect.left,
      y1: markerRect.top + markerRect.height / 2 - gridRect.top,
      x2: cardRect.left - gridRect.left + 2,
      y2: cardRect.top + cardRect.height / 2 - gridRect.top,
    });
  }, [activeNodeId, isMapReady]);

  useEffect(() => {
    if (!isMapReady) {
      return;
    }

    let frameId = 0;
    let frameCount = 0;

    const syncConnector = () => {
      updateConnectorLine();
      frameCount += 1;

      if (frameCount < 26) {
        frameId = window.requestAnimationFrame(syncConnector);
      }
    };

    frameId = window.requestAnimationFrame(syncConnector);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeNodeId, isMapReady, updateConnectorLine]);

  useEffect(() => {
    if (!isMapReady) {
      return;
    }

    const handleRelayout = () => {
      updateConnectorLine();
    };

    window.addEventListener("resize", handleRelayout);
    window.addEventListener("scroll", handleRelayout, true);

    return () => {
      window.removeEventListener("resize", handleRelayout);
      window.removeEventListener("scroll", handleRelayout, true);
    };
  }, [isMapReady, updateConnectorLine]);

  return (
    <section id="mapa" className="mt-20 scroll-mt-28 md:mt-28">
      <div className="section-shell">
        <div className="mb-10 space-y-3">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">Mapa interactivo</p>
          <h2 className="section-heading text-3xl font-semibold md:text-4xl">
            Ruta Alliance 2026: vista operativa del corredor bioceánico.
          </h2>
          <p className="max-w-3xl text-text-muted">
            El mapa muestra focos logísticos por etapa. Selecciona un hito para vincular visualmente el
            punto activo con su card correspondiente.
          </p>
        </div>

        <div ref={gridRef} className="relative grid items-start gap-5 lg:grid-cols-[1fr_0.42fr]">
          {connectorLine ? (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            >
              <defs>
                <linearGradient id="timeline-connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#3DEBFF" stopOpacity="0.82" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.64" />
                </linearGradient>
              </defs>

              <path
                d={`M ${connectorLine.x1} ${connectorLine.y1} C ${connectorLine.x1 + (connectorLine.x2 - connectorLine.x1) * 0.34} ${connectorLine.y1 - 24}, ${connectorLine.x1 + (connectorLine.x2 - connectorLine.x1) * 0.78} ${connectorLine.y2 + 8}, ${connectorLine.x2} ${connectorLine.y2}`}
                fill="none"
                stroke="url(#timeline-connector-gradient)"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeDasharray="5 4"
                opacity={0.85}
                className="timeline-connector-flow"
              />

              <circle cx={connectorLine.x1} cy={connectorLine.y1} r={3.3} fill="#00E5FF" fillOpacity={0.86} />
              <circle cx={connectorLine.x2} cy={connectorLine.y2} r={2.9} fill="#00E5FF" fillOpacity={0.78} />
            </svg>
          ) : null}

          <article className="glass-card relative overflow-hidden rounded-2xl p-3 shadow-2xl shadow-black/35 md:p-4 lg:h-[640px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(0_229_255_/_0.10),transparent_40%),radial-gradient(circle_at_78%_78%,rgb(212_175_55_/_0.08),transparent_36%)]" />
            {isMapReady ? (
              <div className="relative z-10 h-[380px] w-full md:h-[470px] lg:h-full">
                <ComposableMap
                  width={1000}
                  height={620}
                  projection="geoMercator"
                  projectionConfig={{ center: DEFAULT_CENTER, scale: DEFAULT_SCALE }}
                  className="h-full w-full"
                >
                  <ZoomableGroup zoom={1}>
                    <Geographies geography={MAP_GEO_URL}>
                      {({ geographies }) =>
                        geographies
                          .filter((geo) => TARGET_COUNTRIES.has(getGeographyName(geo as GeographyShape)))
                          .map((geo) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#151D31"
                              stroke="#2A344B"
                              strokeWidth={0.6}
                              style={{
                                default: { outline: "none" },
                                hover: { outline: "none", fill: "#1B263E" },
                                pressed: { outline: "none" },
                              }}
                            />
                          ))
                      }
                    </Geographies>

                    {timelineNodes.slice(0, -1).map((node, index) => {
                      const nextNode = timelineNodes[index + 1];
                      const isCompletedSegment = activeNodeIndex > index;
                      const isCurrentSegment = activeNodeIndex === index;

                      return (
                        <Line
                          key={`${node.id}-${nextNode.id}`}
                          from={node.coordinates}
                          to={nextNode.coordinates}
                          stroke={
                            isCompletedSegment || isCurrentSegment
                              ? HUD_LINE_STROKE
                              : ROUTE_LINE_STROKE
                          }
                          strokeWidth={isCompletedSegment ? 1.75 : 1.2}
                          strokeLinecap="round"
                          strokeDasharray={isCompletedSegment ? undefined : "3 4"}
                          style={{
                            opacity: isCompletedSegment ? 0.7 : isCurrentSegment ? 0.5 : 0.34,
                            transition: "opacity 240ms ease",
                          }}
                        />
                      );
                    })}

                    {timelineNodes.map((node, index) => {
                      const isActive = activeNodeId === node.id;

                      return (
                        <g key={node.id}>
                          <Marker coordinates={node.coordinates}>
                            <g
                              ref={(element) => {
                                markerRefs.current[node.id] = element;
                              }}
                              role="button"
                              tabIndex={0}
                              onMouseEnter={() => activateNode(node.id)}
                              onClick={() => activateNode(node.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  activateNode(node.id);
                                }
                              }}
                              className="cursor-pointer"
                              aria-label={`${node.name}, ${node.country}`}
                            >
                              <circle
                                r={isActive ? 10.6 : 6.2}
                                fill={isActive ? "#00E5FF" : "#475569"}
                                fillOpacity={isActive ? 0.28 : 0.72}
                                className={cn("transition-all duration-300", isActive && "marker-pulse")}
                              />
                              <circle
                                r={isActive ? 6.2 : 4.1}
                                fill={isActive ? "#00E5FF" : "#64748B"}
                                className="transition-all duration-300"
                              />
                              <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                y={0.5}
                                fill="#F8FAFC"
                                stroke={isActive ? "#041018" : "none"}
                                strokeWidth={isActive ? 0.45 : 0}
                                paintOrder="stroke"
                                fontSize={isActive ? 5.1 : 3.8}
                                fontWeight={900}
                                style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.01em" }}
                              >
                                {index + 1}
                              </text>

                              {isActive ? (
                                <>
                                  <circle
                                    cx={0}
                                    cy={-11.8}
                                    r={3.9}
                                    fill="#00E5FF"
                                    fillOpacity={0.96}
                                    stroke="#08212C"
                                    strokeWidth={0.7}
                                  />
                                  <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    y={-11.4}
                                    fill="#03141D"
                                    fontSize={3.6}
                                    fontWeight={900}
                                    style={{ pointerEvents: "none", userSelect: "none" }}
                                  >
                                    {index + 1}
                                  </text>
                                </>
                              ) : null}
                            </g>
                          </Marker>
                        </g>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            ) : (
              <div className="flex h-[380px] w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-text-muted md:h-[470px] lg:h-full">
                Cargando mapa del corredor...
              </div>
            )}
          </article>

          <aside className="glass-card rounded-2xl p-5 shadow-2xl shadow-black/35 md:p-6 lg:flex lg:h-[640px] lg:flex-col lg:p-6">
            <p className="font-display text-xs uppercase tracking-[0.16em] text-gold">Ruta Alliance 2026</p>
            <h3 className="mt-1.5 text-lg font-semibold text-text-main">Timeline de activación</h3>
            <div className="mt-4 lg:min-h-0 lg:flex-1">
              <ol className="space-y-[9px]" aria-label="Nodos del corredor">
                {timelineNodes.map((node, index) => {
                  const isActive = activeNodeId === node.id;

                  return (
                    <li
                      key={node.id}
                      ref={(element) => {
                        cardRefs.current[node.id] = element;
                      }}
                      className={cn(
                        "rounded-xl border backdrop-blur-sm transition",
                        isActive
                          ? "border-accent/60 bg-accent/12 shadow-lg shadow-cyan-950/35"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => activateNode(node.id)}
                        onMouseEnter={() => activateNode(node.id)}
                        className="group w-full px-4 py-3 text-left"
                        aria-pressed={isActive}
                      >
                        <div className="flex items-start gap-3.5">
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full border text-[11.5px] font-semibold",
                              isActive
                                ? "border-accent/65 bg-accent/15 text-accent"
                                : "border-white/20 bg-white/5 text-text-muted",
                            )}
                          >
                            {index + 1}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold leading-5 text-text-main">{node.name}</p>
                            <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-text-muted md:text-xs">
                              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                              {node.country} · {node.date}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
