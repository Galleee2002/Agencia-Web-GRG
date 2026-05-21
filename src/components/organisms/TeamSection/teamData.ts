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
  imageWidth: number;
  imageHeight: number;
};
