"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Building2, Mail, MessageSquare, Send, User } from "lucide-react";

import { useI18n, useServiceOptions } from "@/components/providers/I18nProvider";
import {
  CONTACT_NAME_MIN_LENGTH,
  CONTACT_PROJECT_MIN_LENGTH,
} from "@/lib/email/contactSchema";

import { ServiceSelect } from "./ServiceSelect";
import styles from "./ContactSection.module.scss";

const INPUT_ICON_STROKE = 1.75;

type FormStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  service: "",
  project: "",
};

const FORM_ROW_COUNT = 3;
const URL_PATTERN = /https?:\/\//i;

type FormField = keyof typeof INITIAL_FORM;
type FieldErrors = Partial<Record<FormField, string>>;

type FormRevealRowProps = {
  index: number;
  className?: string;
  visible: boolean;
  children: React.ReactNode;
};

function FormRevealRow({
  index,
  className,
  visible,
  children,
}: FormRevealRowProps) {
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
  const { t, locale } = useI18n();
  const serviceOptions = useServiceOptions();
  const formId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const projectTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCardVisible, setIsCardVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visibleRows, setVisibleRows] = useState<Set<number>>(() => new Set());
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isRowVisible = (index: number) => visibleRows.has(index);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => {
        setVisibleRows(
          new Set(Array.from({ length: FORM_ROW_COUNT }, (_, i) => i)),
        );
      });
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => setVisibleRows(new Set()));

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

    return () => {
      cancelAnimationFrame(frame);
      rowObserver.disconnect();
    };
  }, [status]);

  const handleChange = (field: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateClient = useCallback((): FieldErrors => {
    const errors: FieldErrors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const project = form.project.trim();

    if (name.length < CONTACT_NAME_MIN_LENGTH) {
      errors.name = t("contact.validation.nameMin");
    } else if (URL_PATTERN.test(name)) {
      errors.name = t("contact.validation.noUrls");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("contact.validation.emailInvalid");
    }

    if (!form.service) {
      errors.service = t("contact.validation.serviceRequired");
    }

    if (project.length < CONTACT_PROJECT_MIN_LENGTH) {
      errors.project = t("contact.validation.projectMin");
    } else if (URL_PATTERN.test(project)) {
      errors.project = t("contact.validation.noUrls");
    }

    return errors;
  }, [form, t]);

  const mapServerFieldErrors = useCallback(
    (issues: Record<string, string[] | undefined>): FieldErrors => {
      const errors: FieldErrors = {};

      if (issues.name?.length) {
        errors.name =
          issues.name[0] === "Contenido no permitido"
            ? t("contact.validation.noUrls")
            : t("contact.validation.nameMin");
      }

      if (issues.email?.length) {
        errors.email = t("contact.validation.emailInvalid");
      }

      if (issues.service?.length) {
        errors.service = t("contact.validation.serviceRequired");
      }

      if (issues.project?.length) {
        errors.project =
          issues.project[0] === "Contenido no permitido"
            ? t("contact.validation.noUrls")
            : t("contact.validation.projectMin");
      }

      return errors;
    },
    [t],
  );

  const syncProjectTextareaHeight = useCallback(() => {
    const el = projectTextareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    if (status !== "idle") return;
    syncProjectTextareaHeight();
  }, [form.project, status, syncProjectTextareaHeight]);

  useEffect(() => {
    const el = projectTextareaRef.current;
    if (!el || status !== "idle") return;

    const observer = new ResizeObserver(() => syncProjectTextareaHeight());
    observer.observe(el);
    return () => observer.disconnect();
  }, [status, syncProjectTextareaHeight]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const formElement = formRef.current;
    if (!formElement || !formElement.reportValidity()) return;

    const clientErrors = validateClient();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          service: form.service,
          project: form.project.trim(),
          locale,
        }),
      });

      if (response.status === 400) {
        const data = (await response.json()) as {
          error?: string;
          issues?: Record<string, string[] | undefined>;
        };

        if (data.error === "validation_error" && data.issues) {
          setFieldErrors(mapServerFieldErrors(data.issues));
          setStatus("idle");
          return;
        }
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setFieldErrors({});
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
          <p className={styles.successTitle}>{t("contact.successTitle")}</p>
          <p className={styles.successText}>{t("contact.successText")}</p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
          >
            {t("contact.sendAnother")}
          </button>
        </div>
      ) : status === "error" ? (
        <div className={styles.success} role="alert">
          <p className={styles.successTitle}>{t("contact.errorTitle")}</p>
          <p className={styles.successText}>{t("contact.errorText")}</p>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => setStatus("idle")}
          >
            {t("contact.retry")}
          </button>
        </div>
      ) : (
        <form
          ref={formRef}
          id={formId}
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <FormRevealRow
            index={0}
            visible={isRowVisible(0)}
            className={styles.fieldPair}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-name`}>
                {t("contact.name")}
              </label>
              <div className={styles.inputWrap}>
                <User
                  className={styles.inputIcon}
                  strokeWidth={INPUT_ICON_STROKE}
                  aria-hidden
                />
                <input
                  id={`${formId}-name`}
                  className={styles.input}
                  type="text"
                  name="name"
                  placeholder={t("contact.namePlaceholder")}
                  required
                  minLength={CONTACT_NAME_MIN_LENGTH}
                  autoComplete="name"
                  value={form.name}
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={
                    fieldErrors.name ? `${formId}-name-error` : undefined
                  }
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              {fieldErrors.name ? (
                <p
                  id={`${formId}-name-error`}
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-email`}>
                {t("contact.email")}
              </label>
              <div className={styles.inputWrap}>
                <Mail
                  className={styles.inputIcon}
                  strokeWidth={INPUT_ICON_STROKE}
                  aria-hidden
                />
                <input
                  id={`${formId}-email`}
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder={t("contact.emailPlaceholder")}
                  required
                  autoComplete="email"
                  value={form.email}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={
                    fieldErrors.email ? `${formId}-email-error` : undefined
                  }
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              {fieldErrors.email ? (
                <p
                  id={`${formId}-email-error`}
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
          </FormRevealRow>

          <FormRevealRow
            index={1}
            visible={isRowVisible(1)}
            className={styles.fieldPair}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-company`}>
                {t("contact.company")}
                <span className={styles.optional}>
                  {t("contact.optional")}
                </span>
              </label>
              <div className={styles.inputWrap}>
                <Building2
                  className={styles.inputIcon}
                  strokeWidth={INPUT_ICON_STROKE}
                  aria-hidden
                />
                <input
                  id={`${formId}-company`}
                  className={styles.input}
                  type="text"
                  name="company"
                  placeholder={t("contact.companyPlaceholder")}
                  autoComplete="organization"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-service`}>
                {t("contact.service")}
              </label>
              <ServiceSelect
                id={`${formId}-service`}
                name="service"
                required
                placeholder={t("contact.servicePlaceholder")}
                value={form.service}
                options={serviceOptions}
                onChange={(value) => handleChange("service", value)}
              />
              {fieldErrors.service ? (
                <p className={styles.fieldError} role="alert">
                  {fieldErrors.service}
                </p>
              ) : null}
            </div>
          </FormRevealRow>

          <FormRevealRow
            index={2}
            visible={isRowVisible(2)}
            className={`${styles.fieldStack} ${styles.fieldFull}`}
          >
            <div className={styles.field}>
              <label className={styles.label} htmlFor={`${formId}-project`}>
                {t("contact.project")}
              </label>
              <div className={styles.inputWrap}>
                <MessageSquare
                  className={`${styles.inputIcon} ${styles.textareaIcon}`}
                  strokeWidth={INPUT_ICON_STROKE}
                  aria-hidden
                />
                <textarea
                  ref={projectTextareaRef}
                  id={`${formId}-project`}
                  className={styles.textarea}
                  name="project"
                  placeholder={t("contact.projectPlaceholder")}
                  required
                  minLength={CONTACT_PROJECT_MIN_LENGTH}
                  rows={1}
                  value={form.project}
                  aria-invalid={fieldErrors.project ? true : undefined}
                  aria-describedby={
                    fieldErrors.project ? `${formId}-project-error` : undefined
                  }
                  onChange={(e) => handleChange("project", e.target.value)}
                />
              </div>
              {fieldErrors.project ? (
                <p
                  id={`${formId}-project-error`}
                  className={styles.fieldError}
                  role="alert"
                >
                  {fieldErrors.project}
                </p>
              ) : null}
            </div>

            <div className={styles.submitWrap}>
              <button
                type="submit"
                className={styles.submit}
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? t("contact.submitting")
                  : t("contact.submit")}
                <Send strokeWidth={INPUT_ICON_STROKE} aria-hidden />
              </button>
            </div>
          </FormRevealRow>
        </form>
      )}
    </div>
  );
}
