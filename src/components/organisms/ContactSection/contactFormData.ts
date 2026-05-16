export type ContactSelectOption = {
  value: string;
  label: string;
};

export const SERVICE_OPTIONS: ContactSelectOption[] = [
  { value: "corporate", label: "Sitio web corporativo" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "landing", label: "Landing page" },
  { value: "redesign", label: "Rediseño" },
  { value: "maintenance", label: "Mantenimiento" },
  { value: "other", label: "Otro" },
];

export const BUDGET_OPTIONS: ContactSelectOption[] = [
  { value: "under_1m", label: "Menos de $1.000.000 ARS" },
  { value: "1m_3m", label: "$1.000.000 – $3.000.000 ARS" },
  { value: "3m_6m", label: "$3.000.000 – $6.000.000 ARS" },
  { value: "over_6m", label: "Más de $6.000.000 ARS" },
  { value: "undefined", label: "Por definir" },
];

export const TIMELINE_OPTIONS: ContactSelectOption[] = [
  { value: "asap", label: "Lo antes posible" },
  { value: "1_2_months", label: "1–2 meses" },
  { value: "3_6_months", label: "3–6 meses" },
  { value: "flexible", label: "Sin prisa" },
];
