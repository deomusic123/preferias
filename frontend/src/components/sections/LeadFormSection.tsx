"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type FieldPath, useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";
import {
  EXPORTA_OPTIONS,
  INVESTMENT_HORIZONS,
  INVESTMENT_RANGES,
  INVESTOR_AREAS,
  MERCADOS_INTERES,
  PRODUCER_RUBROS,
  RISK_LEVELS,
} from "@/lib/constants";
import {
  investorStepTwoSchema,
  leadSchema,
  producerStepTwoSchema,
  sanitizeLeadPayload,
  stepOneSchema,
  stepThreeSchema,
  type UserType,
} from "@/lib/schemas/lead";
import { cn } from "@/lib/utils";

type StepNumber = 1 | 2 | 3;

type LeadFormValues = {
  tipoUsuario: UserType | "";
  rubro: string;
  subrubro: string;
  paisOperacion: string;
  ciudadOperacion: string;
  exportaActualmente: "Sí" | "No" | "";
  cantidadProduccion: string;
  capacidadProduccion: string;
  certificaciones: string;
  mercadosInteres: string[];
  obstaculoPrincipal: string;
  areaInteres: string;
  rangoInversion: string;
  paisObjetivo: string;
  horizonteInversion: string;
  tipoParticipacion: string;
  experienciaPrevia: string;
  nivelRiesgo: string;
  objetivoEsperado: string;
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  telefono: string;
  paisContacto: string;
  cargo: string;
  mensaje: string;
  consentimiento: boolean;
  honeypot: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

const defaultValues: LeadFormValues = {
  tipoUsuario: "",
  rubro: "",
  subrubro: "",
  paisOperacion: "",
  ciudadOperacion: "",
  exportaActualmente: "",
  cantidadProduccion: "",
  capacidadProduccion: "",
  certificaciones: "",
  mercadosInteres: [],
  obstaculoPrincipal: "",
  areaInteres: "",
  rangoInversion: "",
  paisObjetivo: "",
  horizonteInversion: "",
  tipoParticipacion: "",
  experienciaPrevia: "",
  nivelRiesgo: "",
  objetivoEsperado: "",
  nombre: "",
  apellido: "",
  empresa: "",
  email: "",
  telefono: "",
  paisContacto: "",
  cargo: "",
  mensaje: "",
  consentimiento: false,
  honeypot: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
};

function applyZodIssues(
  issues: z.ZodIssue[],
  setError: UseFormSetError<LeadFormValues>,
): void {
  for (const issue of issues) {
    const [rawPath] = issue.path;

    if (typeof rawPath !== "string") {
      continue;
    }

    setError(rawPath as FieldPath<LeadFormValues>, {
      type: "manual",
      message: issue.message,
    });
  }
}

function getStepTitle(step: StepNumber): string {
  if (step === 1) {
    return "Paso 1 · Perfil";
  }

  if (step === 2) {
    return "Paso 2 · Calificación";
  }

  return "Paso 3 · Contacto";
}

export function LeadFormSection() {
  const router = useRouter();
  const [step, setStep] = useState<StepNumber>(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
  } = useForm<LeadFormValues>({
    mode: "onBlur",
    defaultValues,
  });

  const userType = watch("tipoUsuario");
  const selectedMarkets = watch("mercadosInteres");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setValue("utmSource", params.get("utm_source") ?? "");
    setValue("utmMedium", params.get("utm_medium") ?? "");
    setValue("utmCampaign", params.get("utm_campaign") ?? "");
  }, [setValue]);

  const progress = useMemo(() => {
    return [1, 2, 3].map((stepIndex) => stepIndex <= step);
  }, [step]);

  const goBack = (): void => {
    if (step === 1) {
      return;
    }

    setSubmitError(null);
    clearErrors();
    setStep((current) => (current === 1 ? current : ((current - 1) as StepNumber)));
  };

  const goNext = (): void => {
    setSubmitError(null);
    clearErrors();

    const values = getValues();

    if (step === 1) {
      const result = stepOneSchema.safeParse({ tipoUsuario: values.tipoUsuario });

      if (!result.success) {
        applyZodIssues(result.error.issues, setError);
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (values.tipoUsuario === "productor") {
        const result = producerStepTwoSchema.safeParse(values);

        if (!result.success) {
          applyZodIssues(result.error.issues, setError);
          return;
        }

        setStep(3);
        return;
      }

      if (values.tipoUsuario === "inversor") {
        const result = investorStepTwoSchema.safeParse(values);

        if (!result.success) {
          applyZodIssues(result.error.issues, setError);
          return;
        }

        setStep(3);
        return;
      }

      setError("tipoUsuario", {
        type: "manual",
        message: "Selecciona Productor o Inversor para continuar",
      });
    }
  };

  const toggleMarket = (value: string): void => {
    const currentMarkets = getValues("mercadosInteres");
    const hasMarket = currentMarkets.includes(value);

    const nextMarkets = hasMarket
      ? currentMarkets.filter((market) => market !== value)
      : [...currentMarkets, value];

    setValue("mercadosInteres", nextMarkets, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    clearErrors();

    const stepThreeResult = stepThreeSchema.safeParse(values);

    if (!stepThreeResult.success) {
      applyZodIssues(stepThreeResult.error.issues, setError);
      return;
    }

    const parsedLead = leadSchema.safeParse(values);

    if (!parsedLead.success) {
      applyZodIssues(parsedLead.error.issues, setError);
      return;
    }

    const payload = sanitizeLeadPayload(parsedLead.data);

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        const message =
          result && typeof result.message === "string"
            ? result.message
            : "No fue posible enviar tu solicitud en este momento.";
        throw new Error(message);
      }

      router.push("/gracias");
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al enviar el formulario.",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <section id="formulario" className="mt-20 scroll-mt-28 md:mt-28" aria-label="Formulario de calificación">
      <div className="section-shell">
        <div className="mb-10 space-y-3">
          <p className="font-display text-sm uppercase tracking-[0.18em] text-gold">Aplicación comercial</p>
          <h2 className="section-heading text-3xl font-semibold md:text-4xl">
            Completa tu perfil y solicita tu diagnóstico estratégico.
          </h2>
          <p className="max-w-3xl text-text-muted">
            El proceso está diseñado para calificar oportunidades sin fricción y priorizar contactos de alto
            potencial.
          </p>
        </div>

        <form onSubmit={onSubmit} className="glass-card rounded-2xl p-6 md:p-8">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[10000px] top-auto h-0 w-0 opacity-0"
            {...register("honeypot")}
          />

          <div className="mb-8 flex items-center gap-3">
            {[1, 2, 3].map((stepIndex, index) => (
              <div key={stepIndex} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold",
                    progress[index]
                      ? "border-accent/70 bg-accent/15 text-accent"
                      : "border-white/15 bg-white/5 text-text-muted",
                  )}
                >
                  {stepIndex}
                </div>
                {stepIndex < 3 ? <div className="h-px w-10 bg-white/15" /> : null}
              </div>
            ))}
            <p className="ml-auto text-xs uppercase tracking-[0.12em] text-text-muted">{getStepTitle(step)}</p>
          </div>

          {step === 1 ? (
            <fieldset>
              <legend className="text-sm font-semibold text-text-main">¿Qué perfil deseas registrar?</legend>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition",
                    userType === "productor"
                      ? "border-accent/60 bg-accent/10"
                      : "border-white/12 bg-white/5 hover:border-white/25",
                  )}
                >
                  <input
                    type="radio"
                    value="productor"
                    className="sr-only"
                    {...register("tipoUsuario")}
                  />
                  <p className="font-display text-lg font-semibold text-text-main">Productor</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Empresas productivas con capacidad para escalar a mercados internacionales.
                  </p>
                </label>

                <label
                  className={cn(
                    "cursor-pointer rounded-xl border p-4 transition",
                    userType === "inversor"
                      ? "border-accent/60 bg-accent/10"
                      : "border-white/12 bg-white/5 hover:border-white/25",
                  )}
                >
                  <input
                    type="radio"
                    value="inversor"
                    className="sr-only"
                    {...register("tipoUsuario")}
                  />
                  <p className="font-display text-lg font-semibold text-text-main">Inversor</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Perfiles de inversión orientados a convenios, escalado comercial y proyectos de comex.
                  </p>
                </label>
              </div>
              {errors.tipoUsuario?.message ? (
                <p className="mt-3 text-sm text-red-300">{errors.tipoUsuario.message}</p>
              ) : null}
            </fieldset>
          ) : null}

          {step === 2 && userType === "productor" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="rubro" className="text-sm text-text-main">
                  Rubro
                </label>
                <select
                  id="rubro"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.rubro)}
                  {...register("rubro")}
                >
                  <option value="">Seleccionar</option>
                  {PRODUCER_RUBROS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.rubro?.message ? <p className="mt-1 text-sm text-red-300">{errors.rubro.message}</p> : null}
              </div>

              <div>
                <label htmlFor="subrubro" className="text-sm text-text-main">
                  Subrubro
                </label>
                <input
                  id="subrubro"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.subrubro)}
                  {...register("subrubro")}
                />
                {errors.subrubro?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.subrubro.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="paisOperacion" className="text-sm text-text-main">
                  País de operación
                </label>
                <input
                  id="paisOperacion"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.paisOperacion)}
                  {...register("paisOperacion")}
                />
                {errors.paisOperacion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.paisOperacion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="ciudadOperacion" className="text-sm text-text-main">
                  Ciudad
                </label>
                <input
                  id="ciudadOperacion"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.ciudadOperacion)}
                  {...register("ciudadOperacion")}
                />
                {errors.ciudadOperacion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.ciudadOperacion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="exportaActualmente" className="text-sm text-text-main">
                  ¿Exporta actualmente?
                </label>
                <select
                  id="exportaActualmente"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.exportaActualmente)}
                  {...register("exportaActualmente")}
                >
                  <option value="">Seleccionar</option>
                  {EXPORTA_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.exportaActualmente?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.exportaActualmente.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="cantidadProduccion" className="text-sm text-text-main">
                  Cantidad de producción
                </label>
                <input
                  id="cantidadProduccion"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.cantidadProduccion)}
                  {...register("cantidadProduccion")}
                />
                {errors.cantidadProduccion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.cantidadProduccion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="capacidadProduccion" className="text-sm text-text-main">
                  Capacidad mensual/anual
                </label>
                <input
                  id="capacidadProduccion"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.capacidadProduccion)}
                  {...register("capacidadProduccion")}
                />
                {errors.capacidadProduccion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.capacidadProduccion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="certificaciones" className="text-sm text-text-main">
                  Certificaciones
                </label>
                <input
                  id="certificaciones"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.certificaciones)}
                  {...register("certificaciones")}
                />
                {errors.certificaciones?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.certificaciones.message}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-text-main">Mercados de interés</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {MERCADOS_INTERES.map((market) => {
                    const checked = selectedMarkets.includes(market);

                    return (
                      <label
                        key={market}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                          checked
                            ? "border-accent/50 bg-accent/10 text-text-main"
                            : "border-white/12 bg-white/5 text-text-muted hover:border-white/25",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMarket(market)}
                          className="h-4 w-4 rounded border-white/30 bg-transparent"
                        />
                        {market}
                      </label>
                    );
                  })}
                </div>
                {errors.mercadosInteres?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.mercadosInteres.message}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="obstaculoPrincipal" className="text-sm text-text-main">
                  Principal obstáculo actual
                </label>
                <textarea
                  id="obstaculoPrincipal"
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.obstaculoPrincipal)}
                  {...register("obstaculoPrincipal")}
                />
                {errors.obstaculoPrincipal?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.obstaculoPrincipal.message}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 2 && userType === "inversor" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="areaInteres" className="text-sm text-text-main">
                  Área de interés
                </label>
                <select
                  id="areaInteres"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.areaInteres)}
                  {...register("areaInteres")}
                >
                  <option value="">Seleccionar</option>
                  {INVESTOR_AREAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.areaInteres?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.areaInteres.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="rangoInversion" className="text-sm text-text-main">
                  Rango de inversión
                </label>
                <select
                  id="rangoInversion"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.rangoInversion)}
                  {...register("rangoInversion")}
                >
                  <option value="">Seleccionar</option>
                  {INVESTMENT_RANGES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.rangoInversion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.rangoInversion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="paisObjetivo" className="text-sm text-text-main">
                  País objetivo
                </label>
                <input
                  id="paisObjetivo"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.paisObjetivo)}
                  {...register("paisObjetivo")}
                />
                {errors.paisObjetivo?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.paisObjetivo.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="horizonteInversion" className="text-sm text-text-main">
                  Horizonte de inversión
                </label>
                <select
                  id="horizonteInversion"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.horizonteInversion)}
                  {...register("horizonteInversion")}
                >
                  <option value="">Seleccionar</option>
                  {INVESTMENT_HORIZONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.horizonteInversion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.horizonteInversion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="tipoParticipacion" className="text-sm text-text-main">
                  Tipo de participación
                </label>
                <input
                  id="tipoParticipacion"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.tipoParticipacion)}
                  {...register("tipoParticipacion")}
                />
                {errors.tipoParticipacion?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.tipoParticipacion.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="experienciaPrevia" className="text-sm text-text-main">
                  Experiencia previa
                </label>
                <input
                  id="experienciaPrevia"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.experienciaPrevia)}
                  {...register("experienciaPrevia")}
                />
                {errors.experienciaPrevia?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.experienciaPrevia.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="nivelRiesgo" className="text-sm text-text-main">
                  Nivel de riesgo
                </label>
                <select
                  id="nivelRiesgo"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.nivelRiesgo)}
                  {...register("nivelRiesgo")}
                >
                  <option value="">Seleccionar</option>
                  {RISK_LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.nivelRiesgo?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.nivelRiesgo.message}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="objetivoEsperado" className="text-sm text-text-main">
                  Objetivo esperado
                </label>
                <textarea
                  id="objetivoEsperado"
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.objetivoEsperado)}
                  {...register("objetivoEsperado")}
                />
                {errors.objetivoEsperado?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.objetivoEsperado.message}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="nombre" className="text-sm text-text-main">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.nombre)}
                  {...register("nombre")}
                />
                {errors.nombre?.message ? <p className="mt-1 text-sm text-red-300">{errors.nombre.message}</p> : null}
              </div>

              <div>
                <label htmlFor="apellido" className="text-sm text-text-main">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.apellido)}
                  {...register("apellido")}
                />
                {errors.apellido?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.apellido.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="empresa" className="text-sm text-text-main">
                  Empresa
                </label>
                <input
                  id="empresa"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.empresa)}
                  {...register("empresa")}
                />
                {errors.empresa?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.empresa.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="cargo" className="text-sm text-text-main">
                  Cargo
                </label>
                <input
                  id="cargo"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.cargo)}
                  {...register("cargo")}
                />
                {errors.cargo?.message ? <p className="mt-1 text-sm text-red-300">{errors.cargo.message}</p> : null}
              </div>

              <div>
                <label htmlFor="email" className="text-sm text-text-main">
                  Email corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email?.message ? <p className="mt-1 text-sm text-red-300">{errors.email.message}</p> : null}
              </div>

              <div>
                <label htmlFor="telefono" className="text-sm text-text-main">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.telefono)}
                  {...register("telefono")}
                />
                {errors.telefono?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.telefono.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="paisContacto" className="text-sm text-text-main">
                  País
                </label>
                <input
                  id="paisContacto"
                  type="text"
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.paisContacto)}
                  {...register("paisContacto")}
                />
                {errors.paisContacto?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.paisContacto.message}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="mensaje" className="text-sm text-text-main">
                  Mensaje adicional (opcional)
                </label>
                <textarea
                  id="mensaje"
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-white/15 bg-bg/80 px-3 py-2 text-sm text-text-main outline-none transition focus:border-accent/60"
                  aria-invalid={Boolean(errors.mensaje)}
                  {...register("mensaje")}
                />
                {errors.mensaje?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.mensaje.message}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-start gap-3 rounded-xl border border-white/12 bg-white/5 p-3 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent"
                    aria-invalid={Boolean(errors.consentimiento)}
                    {...register("consentimiento")}
                  />
                  Acepto el tratamiento de datos para recibir diagnóstico comercial y comunicación relacionada.
                </label>
                {errors.consentimiento?.message ? (
                  <p className="mt-1 text-sm text-red-300">{errors.consentimiento.message}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {submitError ? <p className="mt-6 text-sm text-red-300">{submitError}</p> : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 1 || isSubmitting}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-text-muted transition hover:border-white/30 hover:text-text-main disabled:cursor-not-allowed disabled:opacity-50"
            >
              Volver
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goNext}
                className="btn-primary rounded-full px-6 py-2 text-sm font-semibold"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                Solicitar mi diagnóstico
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
