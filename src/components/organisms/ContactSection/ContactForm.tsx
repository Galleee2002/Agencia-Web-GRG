"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { useId, useRef, useState } from "react";
import {
  Building2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

import {
  BUDGET_OPTIONS,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
} from "./contactFormData";
import styles from "./ContactSection.module.scss";

type FormStatus = "idle" | "submitting" | "success";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  service: "",
  project: "",
  budget: "",
  timeline: "",
};

/** Rangos solapados sobre `scrollYProgress` de la sección (0 = entra por abajo, 1 = sale por arriba). */
const REVEAL_NAME: readonly [number, number] = [0.06, 0.2];
const REVEAL_EMAIL: readonly [number, number] = [0.12, 0.26];
const REVEAL_COMPANY: readonly [number, number] = [0.18, 0.32];
const REVEAL_SERVICE: readonly [number, number] = [0.24, 0.4];
const REVEAL_PROJECT: readonly [number, number] = [0.32, 0.5];
const REVEAL_PAIR: readonly [number, number] = [0.42, 0.62];
const REVEAL_SUBMIT: readonly [number, number] = [0.52, 0.78];

function FormReveal({
  progress,
  range,
  className,
  children,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  className: string;
  children: React.ReactNode;
}) {
  const [a, b] = range;
  const peak = Math.min(a + (b - a) * 0.55, 0.98);
  const end = Math.min(b + 0.05, 1);
  // Incluir 0 en las claves para no extrapolar opacidad negativa antes del tramo a.
  const opacity = useTransform(progress, [0, a, peak, end], [0, 0, 1, 1]);
  const y = useTransform(progress, [0, a, b], [26, 26, 0]);
  return (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

export type ContactFormProps = {
  scrollYProgress: MotionValue<number>;
};

export function ContactForm({ scrollYProgress }: ContactFormProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (
    field: keyof typeof INITIAL_FORM,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const formElement = formRef.current;
    if (!formElement || !formElement.reportValidity()) return;

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setStatus("idle");
    formRef.current?.reset();
  };

  if (status === "success") {
    return (
      <div className={styles.formCard}>
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>¡Mensaje enviado!</p>
          <p className={styles.successText}>
            Te contactaremos pronto. Revisamos cada solicitud con atención.
          </p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  const p = scrollYProgress;

  return (
    <div className={styles.formCard}>
      <form
        ref={formRef}
        id={formId}
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <FormReveal progress={p} range={REVEAL_NAME} className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-name`}>
            Nombre
          </label>
          <div className={styles.inputWrap}>
            <User className={styles.inputIcon} aria-hidden />
            <input
              id={`${formId}-name`}
              className={styles.input}
              type="text"
              name="name"
              placeholder="Tu nombre"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
        </FormReveal>

        <FormReveal progress={p} range={REVEAL_EMAIL} className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-email`}>
            Email
          </label>
          <div className={styles.inputWrap}>
            <Mail className={styles.inputIcon} aria-hidden />
            <input
              id={`${formId}-email`}
              className={styles.input}
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </FormReveal>

        <FormReveal progress={p} range={REVEAL_COMPANY} className={styles.field}>
          <label className={styles.label} htmlFor={`${formId}-company`}>
            Empresa<span className={styles.optional}>(opcional)</span>
          </label>
          <div className={styles.inputWrap}>
            <Building2 className={styles.inputIcon} aria-hidden />
            <input
              id={`${formId}-company`}
              className={styles.input}
              type="text"
              name="company"
              placeholder="Nombre de tu empresa"
              autoComplete="organization"
              value={form.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>
        </FormReveal>

        <FormReveal
          progress={p}
          range={REVEAL_SERVICE}
          className={`${styles.field} ${styles.fieldFull}`}
        >
          <label className={styles.label} htmlFor={`${formId}-service`}>
            ¿Qué servicio necesitas?
          </label>
          <div className={styles.inputWrap}>
            <select
              id={`${formId}-service`}
              className={`${styles.select} ${styles.selectNoIcon}`}
              name="service"
              required
              value={form.service}
              onChange={(e) => handleChange("service", e.target.value)}
            >
              <option value="" disabled>
                Selecciona un servicio
              </option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </FormReveal>

        <FormReveal
          progress={p}
          range={REVEAL_PROJECT}
          className={`${styles.field} ${styles.fieldFull}`}
        >
          <label className={styles.label} htmlFor={`${formId}-project`}>
            Cuéntanos sobre tu proyecto
          </label>
          <div className={styles.inputWrap}>
            <MessageSquare
              className={`${styles.inputIcon} ${styles.textareaIcon}`}
              aria-hidden
            />
            <textarea
              id={`${formId}-project`}
              className={styles.textarea}
              name="project"
              placeholder="Describe tu idea, objetivos y referencias..."
              required
              rows={4}
              value={form.project}
              onChange={(e) => handleChange("project", e.target.value)}
            />
          </div>
        </FormReveal>

        <FormReveal
          progress={p}
          range={REVEAL_PAIR}
          className={`${styles.fieldPair} ${styles.fieldFull}`}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-budget`}>
              Presupuesto<span className={styles.optional}>(ARS)</span>
            </label>
            <div className={styles.inputWrap}>
              <select
                id={`${formId}-budget`}
                className={`${styles.select} ${styles.selectNoIcon}`}
                name="budget"
                value={form.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
              >
                <option value="">Selecciona un rango</option>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${formId}-timeline`}>
              Plazo estimado
            </label>
            <div className={styles.inputWrap}>
              <select
                id={`${formId}-timeline`}
                className={`${styles.select} ${styles.selectNoIcon}`}
                name="timeline"
                required
                value={form.timeline}
                onChange={(e) => handleChange("timeline", e.target.value)}
              >
                <option value="" disabled>
                  Selecciona un plazo
                </option>
                {TIMELINE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormReveal>

        <FormReveal
          progress={p}
          range={REVEAL_SUBMIT}
          className={`${styles.submitWrap} ${styles.fieldFull}`}
        >
          <button
            type="submit"
            className={styles.submit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
            <Send aria-hidden />
          </button>
        </FormReveal>
      </form>
    </div>
  );
}
