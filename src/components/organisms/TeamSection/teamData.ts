export type DescriptionPart = {
  text: string;
  emphasize?: boolean;
};

/** Fragmentos del nombre en pantalla; `accent` usa el color acento del sitio. */
export type TeamMemberNameSegment = {
  text: string;
  accent?: boolean;
};

/** Invalida caché de `next/image` al reemplazar ilustraciones en `public/team/`. */
const TEAM_IMAGE_CACHE_VERSION = "20260521";

function teamIllustration(file: string): string {
  const webpName = file.endsWith(".webp")
    ? file
    : `${file.replace(/\.(png|jpe?g|svg)$/i, "")}.webp`;
  return `/team/${webpName}?v=${TEAM_IMAGE_CACHE_VERSION}`;
}

export type TeamMember = {
  name: string;
  /** Si se define, sustituye la representación plana de `name` (p. ej. letras destacadas). */
  nameSegments?: readonly TeamMemberNameSegment[];
  role: string;
  description: readonly DescriptionPart[];
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

export const teamMembers: readonly TeamMember[] = [
  {
    name: "Gael Garcia",
    nameSegments: [
      { text: "Gael " },
      { text: "G", accent: true },
      { text: "arcia" },
    ],
    role: "Desarrollador Web Fullstack",
    description: [
      { text: "Enfocado en " },
      { text: "soluciones web", emphasize: true },
      {
        text: ", rendimiento y experiencias que convierten. Combina criterio de producto con ejecución técnica impecable.",
      },
    ],
    imageSrc: teamIllustration("gael-ilustracion.webp"),
    imageAlt: "Ilustración de Gael Garcia",
    imageWidth: 1086,
    imageHeight: 1448,
  },
  {
    name: "Manuel Rodriguez Garcia",
    nameSegments: [
      { text: "Manuel " },
      { text: "R", accent: true },
      { text: "odriguez " },
      { text: "G", accent: true },
      { text: "arcia" },
    ],
    role: "Desarrollador Web Fullstack",
    description: [
      {
        text: "Traduce la identidad de cada marca en interfaces claras y memorables. ",
      },
      { text: "Diseño y narrativa", emphasize: true },
      {
        text: " alineados a objetivos de negocio, sin perder de vista el detalle visual.",
      },
    ],
    imageSrc: teamIllustration("manuel-ilustracion.webp"),
    imageAlt: "Ilustración de Manuel Rodriguez Garcia",
    imageWidth: 1086,
    imageHeight: 1448,
  },
] as const;
