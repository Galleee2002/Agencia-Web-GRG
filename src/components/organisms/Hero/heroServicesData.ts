/**
 * Cards de servicios del Hero + ilustración central del visual stage.
 * Copy / alts: `hero.services.*` y `hero.visualAlt` en i18n.
 */
export type HeroServiceId =
  | "management"
  | "websites"
  | "invoicing"
  | "ecommerce";

export type HeroServiceCardBase = {
  id: HeroServiceId;
  /**
   * Ruta bajo `public/` para `next/image` (icono de la card).
   * Omitir o dejar `undefined` para mostrar placeholder CSS.
   */
  imageSrc?: string;
  /** Posición asimétrica alrededor de la ilustración central. */
  slot: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
};

/** Ilustración 3D dominante del Hero (navegador sobre base). */
export const HERO_VISUAL_IMAGE_SRC = "/banner.png" as const;
export const HERO_VISUAL_IMAGE_SRC_DARK = "/banner-dark.png" as const;

/** Assets 3D de iconos por card en `public/`. */
export const HERO_SERVICE_IMAGE_PATHS = {
  management: "/admin.png",
  websites: "/impulsamos.png",
  invoicing: "/facturacion.png",
  ecommerce: "/ecommerce.png",
} as const satisfies Record<HeroServiceId, `/${string}.png`>;

export const HERO_SERVICE_CARDS: readonly HeroServiceCardBase[] = [
  {
    id: "management",
    imageSrc: HERO_SERVICE_IMAGE_PATHS.management,
    slot: "topLeft",
  },
  {
    id: "websites",
    imageSrc: HERO_SERVICE_IMAGE_PATHS.websites,
    slot: "topRight",
  },
  {
    id: "invoicing",
    imageSrc: HERO_SERVICE_IMAGE_PATHS.invoicing,
    slot: "bottomLeft",
  },
  {
    id: "ecommerce",
    imageSrc: HERO_SERVICE_IMAGE_PATHS.ecommerce,
    slot: "bottomRight",
  },
];
