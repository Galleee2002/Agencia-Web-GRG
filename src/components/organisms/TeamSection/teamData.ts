export type DescriptionPart = {
  text: string;
  emphasize?: boolean;
};

/** Fragmentos del nombre en pantalla; `accent` usa el color acento del sitio. */
export type TeamMemberNameSegment = {
  text: string;
  accent?: boolean;
};

export type TeamMember = {
  name: string;
  /** Si se define, sustituye la representación plana de `name` (p. ej. letras destacadas). */
  nameSegments?: readonly TeamMemberNameSegment[];
  role: string;
  description: readonly DescriptionPart[];
  imageSrc: string;
  imageAlt: string;
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
    imageSrc: "/team/integrante-1-photo.jpg",
    imageAlt: "Retrato de Integrante 1",
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
    imageSrc: "/team/miembro-2.svg",
    imageAlt: "Retrato de Integrante 2",
  },
] as const;
