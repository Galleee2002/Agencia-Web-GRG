import { publicAssetUrl } from "@/lib/publicAssetUrl";

export type ProjectClientType = "national" | "international" | "grg-tool";

export interface PortfolioProject {
  id: number;
  /** Acento visual del slide (1–7), enlazado a selectores `[data-project-theme]` en SCSS */
  themeId: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  name: string;
  /** Resumen del producto en carrusel y listados. */
  description: string;
  /** Problema del cliente y solución en la página de detalle del proyecto. */
  caseStudyDescription: string;
  clientType: ProjectClientType;
  technologies: string[];
  /**
   * Tres capturas rectangulares. Rutas bajo `public/`.
   * Si una cadena está vacía, la UI muestra un placeholder hasta tener assets.
   */
  images: [string, string, string];
  href: string;
}

export type PortfolioProjectBase = Omit<
  PortfolioProject,
  "description" | "caseStudyDescription"
>;

const PROJECT_IMAGES_BASE = "/projects/resize-imgs";

function projectImage(file: string): string {
  const webpName = file.endsWith(".webp")
    ? file
    : `${file.replace(/\.png$/i, "")}.webp`;
  return publicAssetUrl(`${PROJECT_IMAGES_BASE}/${webpName}`);
}

/**
 * Proyectos de ejemplo. Imágenes WebP bajo `public/projects/resize-imgs/`.
 * `themeId` (1–7) define acentos en ProjectsSection.module.scss (flechas, bordes suaves).
 * Las descripciones visibles se resuelven vía i18n (`getPortfolioProjects`).
 */
export const portfolioProjectsBase: PortfolioProjectBase[] = [
  {
    id: 1,
    themeId: 6,
    name: "Fuera De Contexto",
    clientType: "national",
    technologies: ["React", "Vite", "WebSockets", "S3", "Tailwind CSS"],
    images: [
      projectImage("FUERA1.webp"),
      projectImage("FUERA2.webp"),
      projectImage("FUERA3.webp"),
    ],
    href: "/proyectos/fuera-de-contexto",
  },
  {
    id: 3,
    themeId: 2,
    name: "The Coral Garden",
    clientType: "national",
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Stripe"],
    images: [
      projectImage("GARDEN1.webp"),
      projectImage("GARDEN2.webp"),
      projectImage("GARDEN3.webp"),
    ],
    href: "/proyectos/the-coral-garden",
  },
  {
    id: 7,
    themeId: 7,
    name: "leadScope",
    clientType: "grg-tool",
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL"],
    images: [
      projectImage("leadScope1.webp"),
      projectImage("leadScope2.webp"),
      projectImage("leadScope3.webp"),
    ],
    href: "/proyectos/leadscope",
  },
  {
    id: 2,
    themeId: 1,
    name: "BVI Finance",
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
      projectImage("BVI1.webp"),
      projectImage("BVI2.webp"),
      projectImage("BVI3.webp"),
    ],
    href: "/proyectos/bvi-finance",
  },
  {
    id: 5,
    themeId: 3,
    name: "GPNi",
    clientType: "international",
    technologies: ["React", "D3.js", "Node.js", "Kafka", "AWS"],
    images: [
      projectImage("gpni.webp"),
      projectImage("gpni2.webp"),
      projectImage("gpni3.webp"),
    ],
    href: "/proyectos/gpni",
  },
  {
    id: 4,
    themeId: 4,
    name: "CIL Labs",
    clientType: "international",
    technologies: ["Next.js", "React", "FHIR", "PostgreSQL", "Auth0"],
    images: [
      projectImage("CIL1.webp"),
      projectImage("CIL2.webp"),
      projectImage("CIL3.webp"),
    ],
    href: "/proyectos/cil-labs",
  },
  {
    id: 6,
    themeId: 5,
    name: "El Sapito 3D",
    clientType: "national",
    technologies: ["Next.js", "React", "tRPC", "Prisma", "Redis"],
    images: [
      projectImage("SAPO1.webp"),
      projectImage("SAPO2.webp"),
      projectImage("SAPO3.webp"),
    ],
    href: "/proyectos/sapito3d",
  },
];
