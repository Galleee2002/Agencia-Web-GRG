"use client";

import { useEffect, useId, useRef, useState } from "react";
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

const FORM_ROW_COUNT = 8;

type FormRevealRowProps = {
  index: number;
  className?: string;
  visible: boolean;
  children: React.ReactNode;
};

function FormRevealRow({ index, className, visible, children }: FormRevealRowProps) {
  return (
    <div
      className={`${styles.formRevealRow}${className ? ` ${className}` : ""}`}
      data-reveal-row
      data-reveal-index={index}
      data-row-visible={visible ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export function ContactForm() {
  const formId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [visibleRows, setVisibleRows] = useState<Set<number>>(() => new Set());
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState(INITIAL_FORM);

  const isRowVisible = (index: number) => visibleRows.has(index);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsCardVisible(true);
      return;
    }

    const cardObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsCardVisible(entry.isIntersecting);
      },
      { threshold: [0, 0.12, 0.28], rootMargin: "0px 0px 6% 0px" },
    );

    cardObserver.observe(el);
    return () => cardObserver.disconnect();
  }, []);

  useEffect(() => {
    if (status === "success") return;

    const form = formRef.current;
    if (!form) return;

    setVisibleRows(new Set());

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleRows(new Set(Array.from({ length: FORM_ROW_COUNT }, (_, i) => i)));
      return;
    }

    const rows = form.querySelectorAll<HTMLElement>("[data-reveal-row]");
    if (!rows.length) return;

    const rowObserver = new IntersectionObserver(
      (entries) => {
        setVisibleRows((prev) => {
          const next = new Set(prev);
          let changed = false;

          for (const entry of entries) {
            const index = Number(
              (entry.target as HTMLElement).dataset.revealIndex,
            );
            if (Number.isNaN(index)) continue;

            if (entry.isIntersecting) {
              if (!next.has(index)) {
                next.add(index);
                changed = true;
              }
            } else if (next.delete(index)) {
              changed = true;
            }
          }

          return changed ? next : prev;
        });
      },
      { threshold: [0, 0.18, 0.35], rootMargin: "0px 0px -10% 0px" },
    );

    rows.forEach((row) => rowObserver.observe(row));

    return () => rowObserver.disconnect();
  }, [status]);

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

  return (
    <div
      ref={cardRef}
      className={styles.formCard}
      data-form-visible={isCardVisible ? "true" : "false"}
    >
      {status === "success" ? (
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
      ) : (
      <form
        ref={formRef}
        id={formId}
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <FormRevealRow index={0} visible={isRowVisible(0)} className={styles.field}>
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
        </FormRevealRow>

        <FormRevealRow index={1} visible={isRowVisible(1)} className={styles.field}>
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
        </FormRevealRow>

        <FormRevealRow index={2} visible={isRowVisible(2)} className={styles.field}>
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
        </FormRevealRow>

        <FormRevealRow index={3} visible={isRowVisible(3)} className={`${styles.field} ${styles.fieldFull}`}>
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
        </FormRevealRow>

        <FormRevealRow index={4} visible={isRowVisible(4)} className={`${styles.field} ${styles.fieldFull}`}>
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
        </FormRevealRow>

        <FormRevealRow index={5} visible={isRowVisible(5)} className={styles.field}>
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
        </FormRevealRow>

        <FormRevealRow index={6} visible={isRowVisible(6)} className={styles.field}>
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
        </FormRevealRow>

        <FormRevealRow
          index={7}
          visible={isRowVisible(7)}
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
        </FormRevealRow>
      </form>
      )}
    </div>
  );
}
