export type ProjectClientType = "national" | "international";

export interface PortfolioProject {
  id: number;
  /** Acento visual del slide (1–6), enlazado a selectores `[data-project-theme]` en SCSS */
  themeId: 1 | 2 | 3 | 4 | 5 | 6;
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

/** Subir al reemplazar capturas en `public/projects/` (invalida caché de `next/image`). */
const PROJECT_IMAGE_CACHE_VERSION = "20260519";

function projectImage(path: string): string {
  return `${path}?v=${PROJECT_IMAGE_CACHE_VERSION}`;
}

/**
 * Proyectos de ejemplo. Imágenes bajo `public/` (p. ej. `public/projects/...`).
 * `themeId` (1–6) define acentos en ProjectsSection.module.scss (flechas, bordes suaves).
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
      projectImage("/projects/BVI1.png"),
      projectImage("/projects/BVI2.png"),
      projectImage("/projects/BVI3.png"),
    ],
    href: "/proyectos/bvi-finance",
  },
  {
    id: 2,
    themeId: 2,
    name: "The Coral Garden",
    description:
      "Tienda virtual y sitio web desarrollado para un emprendimiento argentino especializado en filtros de agua para cultivo. La plataforma presenta sus productos de forma clara y profesional, destacando la importancia de la calidad del agua en el crecimiento, cuidado y mantenimiento de cultivos.",
    clientType: "national",
    technologies: ["Next.js", "React", "TypeScript", "PostgreSQL", "Stripe"],
    images: [
      projectImage("/projects/GARDEN1.png"),
      projectImage("/projects/GARDEN2.png"),
      projectImage("/projects/GARDEN3.png"),
    ],
    href: "/proyectos/the-coral-garden",
  },
  {
    id: 3,
    themeId: 3,
    name: "GPNi",
    description:
      "Plataforma educativa internacional desarrollada para un equipo con presencia en China, Japón y Estados Unidos. El sistema centraliza cursos, webinars, seminarios y contenido sobre nutrición, vida fitness y formación profesional, ofreciendo una experiencia organizada para usuarios y administradores.",
    clientType: "international",
    technologies: ["React", "D3.js", "Node.js", "Kafka", "AWS"],
    images: [
      projectImage("/projects/gpni.png"),
      projectImage("/projects/gpni2.png"),
      projectImage("/projects/gpni3.png"),
    ],
    href: "/proyectos/gpni",
  },
  {
    id: 4,
    themeId: 4,
    name: "CIL Labs",
    description:
      "Plataforma educativa con inteligencia artificial integrada desarrollada para una institución vinculada a China y Estados Unidos. El sistema permite que docentes creen tareas y que alumnos suban videos hablando en inglés para recibir feedback automático orientado a mejorar su desempeño oral.",
    clientType: "international",
    technologies: ["Next.js", "React", "FHIR", "PostgreSQL", "Auth0"],
    images: [
      projectImage("/projects/CIL1.png"),
      projectImage("/projects/CIL2.png"),
      projectImage("/projects/CIL3.png"),
    ],
    href: "/proyectos/cil-labs",
  },
  {
    id: 5,
    themeId: 5,
    name: "El Sapito 3D",
    description:
      "Ecommerce desarrollado para un emprendimiento argentino dedicado a la venta de objetos impresos en 3D. La plataforma cuenta con catálogo de productos, base de datos, servidor, carrito de compras y pagos online, permitiendo gestionar y vender productos de forma profesional.",
    clientType: "national",
    technologies: ["Next.js", "React", "tRPC", "Prisma", "Redis"],
    images: [
      projectImage("/projects/SAPO1.png"),
      projectImage("/projects/SAPO2.png"),
      projectImage("/projects/SAPO3.png"),
    ],
    href: "/proyectos/sapito3d",
  },
  {
    id: 6,
    themeId: 6,
    name: "Fuera De Contexto",
    description:
      "Ecommerce desarrollado para una marca argentina de indumentaria orientada a la venta online de ropa. La plataforma incorpora catálogo de productos, base de datos, servidor, carrito de compras y pagos online, ofreciendo una experiencia clara para clientes y administradores.",
    clientType: "national",
    technologies: ["React", "Vite", "WebSockets", "S3", "Tailwind CSS"],
    images: [
      projectImage("/projects/FUERA1.png"),
      projectImage("/projects/FUERA2.png"),
      projectImage("/projects/FUERA3.png"),
    ],
    href: "/proyectos/fuera-de-contexto",
  },
];
