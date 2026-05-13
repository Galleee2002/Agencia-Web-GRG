export type ProjectClientType = "national" | "international";

export interface PortfolioProject {
  id: number;
  /** Acento visual del slide (1–7), enlazado a selectores `[data-project-theme]` en SCSS */
  themeId: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  description: string;
  clientType: ProjectClientType;
  technologies: string[];
  /**
   * Tres capturas rectangulares. Rutas bajo `public/`.
   * Si una cadena está vacía, la UI muestra un placeholder hasta tener assets.
   */
  images: [string, string, string];
  href: string;
}

export function clientLabel(type: ProjectClientType): string {
  return type === "national" ? "Nacional" : "Internacional";
}

/**
 * Proyectos de ejemplo. Imágenes bajo `public/` (p. ej. `public/projects/...`).
 * `themeId` (1–7) define acentos en ProjectsSection.module.scss (flechas, bordes suaves).
 */
export const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    themeId: 1,
    name: "BVI Finance",
    description:
      "Sistema web administrativo desarrollado para una organización financiera internacional con base en las British Virgin Islands. La plataforma centraliza la gestión de eventos, noticias, newsletters, membresías, miembros, legislación y publicaciones, ofreciendo una experiencia completa tanto para usuarios como para administradores.",
    clientType: "international",
    technologies: [
      "React",
      "JavaScript",
      "SCSS",
      "LocalStorage",
      "TipTap",
      "Responsive Design",
    ],
    images: [
      "/projects/bvi-dashboard.png",
      "/projects/bvi-memberships.png",
      "/projects/bvi-login.png",
    ],
    href: "/proyectos/bvi-finance",
  },
  {
    id: 2,
    themeId: 2,
    name: "Retail Norte",
    description:
      "E-commerce headless con catálogo complejo, checkout optimizado e integración con ERP. Rendimiento estable en picos de campaña.",
    clientType: "national",
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Stripe"],
    images: ["", "", ""],
    href: "/proyectos/retail-norte",
  },
  {
    id: 3,
    themeId: 3,
    name: "FinTech Atlas",
    description:
      "Panel de analítica y reporting en tiempo casi real para equipos de riesgo y operaciones, con roles y auditoría.",
    clientType: "international",
    technologies: ["React", "D3.js", "Node.js", "Kafka", "AWS"],
    images: ["", "", ""],
    href: "/proyectos/fintech-atlas",
  },
  {
    id: 4,
    themeId: 4,
    name: "Salud+",
    description:
      "Portal de pacientes con turnos, historial resumido y recordatorios. Accesibilidad y cumplimiento de datos desde el diseño.",
    clientType: "national",
    technologies: ["Next.js", "React", "FHIR", "PostgreSQL", "Auth0"],
    images: ["", "", ""],
    href: "/proyectos/salud-plus",
  },
  {
    id: 5,
    themeId: 5,
    name: "Orbit CRM",
    description:
      "CRM con pipeline visual, automatizaciones y reporting para equipos B2B que necesitan claridad sin fricción.",
    clientType: "international",
    technologies: ["Next.js", "React", "tRPC", "Prisma", "Redis"],
    images: ["", "", ""],
    href: "/proyectos/orbit-crm",
  },
  {
    id: 6,
    themeId: 6,
    name: "Lens Studio",
    description:
      "Plataforma creativa para gestionar briefs, versiones y aprobaciones con vista previa en tiempo real.",
    clientType: "national",
    technologies: ["React", "Vite", "WebSockets", "S3", "Tailwind CSS"],
    images: ["", "", ""],
    href: "/proyectos/lens-studio",
  },
  {
    id: 7,
    themeId: 7,
    name: "Vivid Commerce",
    description:
      "Tienda y vitrina digital con identidad de alto contraste: catálogo claro, storytelling de marca y checkout ágil para campañas multicanal.",
    clientType: "international",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Shopify",
      "Sanity",
      "Vercel",
    ],
    images: ["", "", ""],
    href: "/proyectos/vivid-commerce",
  },
];
