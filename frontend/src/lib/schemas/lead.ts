import { z } from "zod";

export const USER_TYPE_OPTIONS = ["productor", "inversor"] as const;
export type UserType = (typeof USER_TYPE_OPTIONS)[number];

const textField = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(min, `${label} es obligatorio`)
    .max(120, `${label} es demasiado largo`);

const optionalTextField = (max = 280) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .optional()
    .or(z.literal(""));

export const baseLeadSchema = z.object({
  tipoUsuario: z.enum(USER_TYPE_OPTIONS),
  nombre: textField("Nombre"),
  apellido: textField("Apellido"),
  empresa: textField("Empresa"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email inválido")
    .max(120, "Email demasiado largo"),
  telefono: z
    .string()
    .trim()
    .min(6, "Teléfono inválido")
    .max(30, "Teléfono inválido"),
  paisContacto: textField("País"),
  cargo: textField("Cargo"),
  mensaje: optionalTextField(500),
  consentimiento: z.boolean().refine((value) => value, {
    message: "Debes aceptar el tratamiento de datos para continuar",
  }),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  utmSource: optionalTextField(120),
  utmMedium: optionalTextField(120),
  utmCampaign: optionalTextField(120),
});

export const producerSchema = baseLeadSchema.extend({
  tipoUsuario: z.literal("productor"),
  rubro: textField("Rubro"),
  subrubro: textField("Subrubro"),
  paisOperacion: textField("País de operación"),
  ciudadOperacion: textField("Ciudad"),
  exportaActualmente: z.enum(["Sí", "No"]),
  cantidadProduccion: textField("Cantidad de producción", 1),
  capacidadProduccion: textField("Capacidad de producción", 1),
  certificaciones: textField("Certificaciones", 1),
  mercadosInteres: z.array(z.string()).min(1, "Selecciona al menos un mercado"),
  obstaculoPrincipal: z
    .string()
    .trim()
    .min(8, "Describe el principal obstáculo")
    .max(280, "Máximo 280 caracteres"),
});

export const investorSchema = baseLeadSchema.extend({
  tipoUsuario: z.literal("inversor"),
  areaInteres: textField("Área de interés"),
  rangoInversion: textField("Rango de inversión"),
  paisObjetivo: textField("País de interés"),
  horizonteInversion: textField("Horizonte de inversión"),
  tipoParticipacion: textField("Tipo de participación"),
  experienciaPrevia: textField("Experiencia previa", 1),
  nivelRiesgo: textField("Nivel de riesgo"),
  objetivoEsperado: z
    .string()
    .trim()
    .min(8, "Describe el objetivo esperado")
    .max(280, "Máximo 280 caracteres"),
});

export const leadSchema = z.discriminatedUnion("tipoUsuario", [
  producerSchema,
  investorSchema,
]);

export const stepOneSchema = z.object({
  tipoUsuario: z.enum(USER_TYPE_OPTIONS),
});

export const producerStepTwoSchema = producerSchema.pick({
  rubro: true,
  subrubro: true,
  paisOperacion: true,
  ciudadOperacion: true,
  exportaActualmente: true,
  cantidadProduccion: true,
  capacidadProduccion: true,
  certificaciones: true,
  mercadosInteres: true,
  obstaculoPrincipal: true,
});

export const investorStepTwoSchema = investorSchema.pick({
  areaInteres: true,
  rangoInversion: true,
  paisObjetivo: true,
  horizonteInversion: true,
  tipoParticipacion: true,
  experienciaPrevia: true,
  nivelRiesgo: true,
  objetivoEsperado: true,
});

export const stepThreeSchema = baseLeadSchema.pick({
  nombre: true,
  apellido: true,
  empresa: true,
  email: true,
  telefono: true,
  paisContacto: true,
  cargo: true,
  mensaje: true,
  consentimiento: true,
  honeypot: true,
});

export type ProducerLeadData = z.infer<typeof producerSchema>;
export type InvestorLeadData = z.infer<typeof investorSchema>;
export type LeadData = z.infer<typeof leadSchema>;

export function sanitizeLeadPayload(payload: LeadData): LeadData {
  const normalized = {
    ...payload,
    nombre: payload.nombre.trim(),
    apellido: payload.apellido.trim(),
    empresa: payload.empresa.trim(),
    email: payload.email.trim().toLowerCase(),
    telefono: payload.telefono.trim(),
    paisContacto: payload.paisContacto.trim(),
    cargo: payload.cargo.trim(),
    mensaje: payload.mensaje?.trim() ?? "",
    utmSource: payload.utmSource?.trim() ?? "",
    utmMedium: payload.utmMedium?.trim() ?? "",
    utmCampaign: payload.utmCampaign?.trim() ?? "",
  };

  if (normalized.tipoUsuario === "productor") {
    return {
      ...normalized,
      rubro: normalized.rubro.trim(),
      subrubro: normalized.subrubro.trim(),
      paisOperacion: normalized.paisOperacion.trim(),
      ciudadOperacion: normalized.ciudadOperacion.trim(),
      cantidadProduccion: normalized.cantidadProduccion.trim(),
      capacidadProduccion: normalized.capacidadProduccion.trim(),
      certificaciones: normalized.certificaciones.trim(),
      obstaculoPrincipal: normalized.obstaculoPrincipal.trim(),
      mercadosInteres: normalized.mercadosInteres.map((item) => item.trim()),
    };
  }

  return {
    ...normalized,
    areaInteres: normalized.areaInteres.trim(),
    rangoInversion: normalized.rangoInversion.trim(),
    paisObjetivo: normalized.paisObjetivo.trim(),
    horizonteInversion: normalized.horizonteInversion.trim(),
    tipoParticipacion: normalized.tipoParticipacion.trim(),
    experienciaPrevia: normalized.experienciaPrevia.trim(),
    nivelRiesgo: normalized.nivelRiesgo.trim(),
    objetivoEsperado: normalized.objetivoEsperado.trim(),
  };
}
