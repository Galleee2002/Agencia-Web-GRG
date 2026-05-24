/**
 * Invalida la caché de `next/image` al reemplazar archivos en `public/`.
 * Sube este valor (o `NEXT_PUBLIC_ASSET_CACHE_VERSION` en `.env.local`) tras cambiar assets.
 */
export const PUBLIC_ASSET_CACHE_VERSION =
  process.env.NEXT_PUBLIC_ASSET_CACHE_VERSION ?? "20260526";

/** Ruta bajo `public/` con query `?v=` para bust de caché del optimizador. */
export function publicAssetUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const [pathname, search = ""] = normalized.split("?");
  const params = new URLSearchParams(search);
  params.set("v", PUBLIC_ASSET_CACHE_VERSION);
  return `${pathname}?${params.toString()}`;
}
