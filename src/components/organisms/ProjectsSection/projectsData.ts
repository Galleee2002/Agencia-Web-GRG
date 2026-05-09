export type ClientScope = "national" | "international";

export interface ProjectItem {
  name: string;
  description: string;
  clientScope: ClientScope;
  href: string;
  image?: string;
  imageAlt?: string;
}

export const projects: ProjectItem[] = [
  {
    name: "Retail Norte",
    description:
      "E-commerce headless con catálogo complejo, checkout optimizado y integración con ERP. Rendimiento estable en picos de campaña.",
    clientScope: "national",
    href: "/proyectos/retail-norte",
  },
  {
    name: "FinTech Atlas",
    description:
      "Panel de analítica y reporting en tiempo casi real para equipos de riesgo y operaciones, con roles y auditoría.",
    clientScope: "international",
    href: "/proyectos/fintech-atlas",
  },
  {
    name: "Salud+",
    description:
      "Portal de pacientes con turnos, historial resumido y recordatorios. Accesibilidad y cumplimiento de datos desde el diseño.",
    clientScope: "national",
    href: "/proyectos/salud-plus",
  },
  {
    name: "Studio Berlin",
    description:
      "Sitio editorial con CMS a medida, tipografía de marca y piezas motion ligeras sin sacrificar LCP.",
    clientScope: "international",
    href: "/proyectos/studio-berlin",
  },
  {
    name: "Logística Origen",
    description:
      "Seguimiento de envíos y estados para B2B: vistas por cliente, alertas y API para partners logísticos.",
    clientScope: "national",
    href: "/proyectos/logistica-origen",
  },
];
