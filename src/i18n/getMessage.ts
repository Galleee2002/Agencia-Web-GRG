import type { InterpolationParams, Messages, TranslationKey } from "./types";

function interpolate(
  template: string,
  params?: InterpolationParams,
): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = params[key];
    return value !== undefined ? String(value) : `{{${key}}}`;
  });
}

function resolvePath(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function getMessage(
  messages: Messages,
  key: TranslationKey,
  params?: InterpolationParams,
): string {
  const value = resolvePath(messages, key);
  if (value === undefined) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] Missing translation key: ${key}`);
    }
    return key;
  }
  return interpolate(value, params);
}
