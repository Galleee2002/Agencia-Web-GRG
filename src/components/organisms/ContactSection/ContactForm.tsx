"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Building2, Mail, MessageSquare, Send, User } from "lucide-react";

import { useI18n, useServiceOptions } from "@/components/providers/I18nProvider";

import { ServiceSelect } from "./ServiceSelect";
import styles from "./ContactSection.module.scss";

const INPUT_ICON_STROKE = 1.75;

type FormStatus = "idle" | "submitting" | "success";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
  service: "",
  project: "",
};

const FORM_ROW_COUNT = 3;

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
  const { t } = useI18n();
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

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
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
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
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
                  rows={1}
                  value={form.project}
                  onChange={(e) => handleChange("project", e.target.value)}
                />
              </div>
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
