export const COMPANY_NAME = "Alliance 2.0";

export const NAV_LINKS = [
  { label: "Valor", href: "#valor" },
  { label: "Mapa", href: "#mapa" },
  { label: "Diagnóstico", href: "#formulario" },
] as const;

export type AuthorityLogo = {
  name: string;
  src?: string;
};

export const AUTHORITY_LOGOS: AuthorityLogo[] = [
  { name: "CEAP", src: "/ceap.png" },
  { name: "Corredor Bioceánico" },
  { name: "Comex Alliance" },
  { name: "Trade Network" },
  { name: "Export Hub" },
  { name: "Andes Industrial" },
  { name: "Pampa Growth" },
  { name: "Mercados Globales" },
  { name: "Pacific Gate" },
];

export type ValueCard = {
  title: string;
  description: string;
};

export const VALUE_CARDS: ValueCard[] = [
  {
    title: "Convenios Internacionales",
    description:
      "Estructuramos acuerdos para que productores e inversores operen de forma segura en comercio exterior.",
  },
  {
    title: "Calificación Comercial",
    description:
      "Filtramos oportunidades con datos reales para acelerar decisiones y priorizar contactos de alto potencial.",
  },
  {
    title: "Acompañamiento Estratégico",
    description:
      "Asistencia técnica y comercial en requisitos, mercados objetivo, logística y posicionamiento internacional.",
  },
  {
    title: "Red B2B Internacional",
    description:
      "Conectamos actores de distintos sectores productivos con capital y demanda para generar crecimiento sostenible.",
  },
];

export type MapNode = {
  id: string;
  name: string;
  country: "Chile" | "Argentina";
  date: string;
  description: string;
  coordinates: [number, number];
  labelOffset: [number, number];
};

export const MAP_GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const MAP_NODES: MapNode[] = [
  {
    id: "corrientes",
    name: "Corrientes",
    country: "Argentina",
    date: "Abril 2026",
    description:
      "Inicio de la Ruta Alliance. Nodo estratégico para el Litoral y apertura de la pre-feria comercial.",
    coordinates: [-58.8341, -27.4692],
    labelOffset: [2.2, -1.5],
  },
  {
    id: "santa-fe",
    name: "Santa Fe",
    country: "Argentina",
    date: "Mayo 2026",
    description:
      "Eje agroindustrial e industrial para activar acuerdos de exportación con trazabilidad operativa.",
    coordinates: [-60.7004, -31.6333],
    labelOffset: [2.1, -1.4],
  },
  {
    id: "mendoza",
    name: "Mendoza",
    country: "Argentina",
    date: "Junio 2026",
    description:
      "Punto logístico clave para cruces andinos y consolidación de salida hacia el Pacífico.",
    coordinates: [-68.8458, -32.8895],
    labelOffset: [2.1, -1.3],
  },
  {
    id: "salta",
    name: "Salta",
    country: "Argentina",
    date: "Julio 2026",
    description:
      "Nodo del norte argentino con foco en integración productiva y expansión exportadora regional.",
    coordinates: [-65.4232, -24.7821],
    labelOffset: [2.1, -1.8],
  },
  {
    id: "tucuman",
    name: "Tucumán",
    country: "Argentina",
    date: "Agosto 2026",
    description:
      "Plaza estratégica para articulación industrial y comercial del corredor bioceánico.",
    coordinates: [-65.2226, -26.8083],
    labelOffset: [2, -1.4],
  },
  {
    id: "caba",
    name: "CABA",
    country: "Argentina",
    date: "Septiembre 2026",
    description:
      "Centro corporativo y financiero para estructuración de convenios, inversión y escalado B2B.",
    coordinates: [-58.3816, -34.6037],
    labelOffset: [1.9, -1.2],
  },
  {
    id: "penaflor",
    name: "Peñaflor",
    country: "Chile",
    date: "Octubre 2026",
    description:
      "Nodo de llegada al Pacífico para cierre logístico, validación comercial y proyección internacional.",
    coordinates: [-70.8763, -33.6117],
    labelOffset: [-2.6, -1.1],
  },
];

export const PRODUCER_RUBROS = [
  "Agro",
  "Ganadería",
  "Minería",
  "Metalurgia",
  "Tecnología",
  "Manufactura",
  "Servicios Exportables",
  "Otro",
] as const;

export const EXPORTA_OPTIONS = ["Sí", "No"] as const;

export const MERCADOS_INTERES = [
  "Sudamérica",
  "Norteamérica",
  "Europa",
  "Asia",
  "Medio Oriente",
  "África",
] as const;

export const INVESTOR_AREAS = [
  "Agroindustria",
  "Minería",
  "Tecnología",
  "Infraestructura",
  "Energía",
  "Logística",
  "Comercio Exterior",
] as const;

export const INVESTMENT_RANGES = [
  "USD 50.000 - 250.000",
  "USD 250.000 - 1.000.000",
  "USD 1.000.000 - 5.000.000",
  "Más de USD 5.000.000",
] as const;

export const INVESTMENT_HORIZONS = [
  "0-6 meses",
  "6-12 meses",
  "12-24 meses",
  "Más de 24 meses",
] as const;

export const RISK_LEVELS = ["Conservador", "Moderado", "Agresivo"] as const;
