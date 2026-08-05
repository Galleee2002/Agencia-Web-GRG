# Contexto para prompts (Cursor / ChatGPT)

Brief reutilizable del proyecto **GRG Solutions** (Agencia Web GRG / GMG en package). Úsalo para generar prompts concisos para un agente de código en Cursor.

---

## Instrucción para ChatGPT

> Genera un **prompt conciso en español** (máx. ~800 palabras) para un agente de código en **Cursor** que trabaje en este repositorio. El prompt debe incluir: stack, arquitectura, reglas de estilos, sistema visual, animaciones, i18n, tema, SEO/contacto y restricciones. No inventes tecnologías ni patrones que no estén listados abajo. Prioriza instrucciones accionables (“haz X”, “no hagas Y”). El agente puede tocar la landing, case studies, legales o la API de contacto.

---

## Qué es el proyecto

- **Nombre de marca:** GRG Solutions (`SITE_NAME` en `src/config/site.ts`). El repo/package también aparece como Agencia Web GRG / `agencia-web-gmg`.
- **Tipo:** Sitio corporativo con **landing principal** (anclas) + rutas satélite (case studies, legales) + API de contacto.
- **Idioma default UI:** Español (`lang="es"` en layout; locale i18n `es` / `en`).
- **Objetivo:** Portfolio, proceso, equipo, contacto; estética premium tipo producto (inspiración Framer).
- **Repo:** `Agencia-Web-GMG` — proyecto privado, despliegue en **Vercel**.
- **Site URL:** `https://grgsolutions.com.ar` (`NEXT_PUBLIC_SITE_URL` opcional).

---

## Stack tecnológico

| Tecnología | Versión / nota |
|------------|----------------|
| **Next.js** | 16.2.4 — App Router (`src/app/`), `next dev --webpack` |
| **React** | 19.2.4 |
| **TypeScript** | 5.x — `strict: true` |
| **Gestor** | **pnpm** 10.33.0 (`packageManager` en `package.json`) |
| **Tailwind CSS** | 4.2.4 — utilidades + tokens shadcn |
| **SCSS** | Sass 1.99 — **CSS Modules** (`.module.scss`) como estilo principal por componente |
| **shadcn/ui** | v4 — preset `radix-vega`, iconos **Lucide** |
| **Animación** | **GSAP** 3.13 (menú, proyectos, scroll) + **Motion** (`motion/react`) en contacto y footer |
| **WebGL / efectos** | `ogl` (Plasma), componentes custom (beams) |
| **Validación / email** | **Zod** 4 + **Resend** + **React Email** (`emails/`) |
| **Utilidades CSS** | `clsx` + `tailwind-merge` → helper `cn()` en `@/lib/utils` |
| **Imágenes** | `next/image` con `qualities: [72, 75]` y `localPatterns` en `next.config.ts`; assets vía `publicAssetUrl()` |

**Scripts:** `pnpm dev` | `pnpm build` | `pnpm start` | `pnpm lint` | `pnpm email` | `pnpm optimize:assets` | `pnpm optimize:projects`

**Env (contacto):** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_NOTIFY_EMAIL` — ver `.env.example`. No commitear secretos.

---

## Rutas (`src/app/`)

| Ruta | Rol |
|------|-----|
| `/` | Landing (HomePage → HomeTemplate) |
| `/proyectos/[slug]` | Case study por proyecto (`generateStaticParams`) |
| `/privacidad`, `/terminos`, `/cookies` | Legales (`LegalDocumentPage`) |
| `/api/contact` | `POST` — valida con Zod y envía con Resend |
| `robots.ts` / `sitemap.ts` | SEO crawl / índice |

---

## Cómo trabajamos los estilos

**Enfoque híbrido — no es solo Tailwind ni solo SCSS.**

### 1. SCSS Modules (prioridad)

- Un `.module.scss` por organismo/sección (`Hero.module.scss`, `ProjectsSection.module.scss`, etc.).
- Tokens de diseño como variables SCSS al inicio del archivo (`$framer-blue`, `$pure-white`, `$hero-ink`, etc.).
- Comentarios que referencian [`DESIGN.md`](./DESIGN.md) (ej. `// DESIGN.md — Framer-inspired tokens`).
- BEM-like o nombres semánticos (`hero`, `inner`, `title`, `cta`).
- `clamp()` para tipografía y espaciado responsive.
- Breakpoints documentados: móvil `<809px`, tablet `809–1199px`, desktop `>1199px`.
- Siempre respetar `prefers-reduced-motion: reduce`.

### 2. Tailwind CSS 4

- Entrada global: `src/app/tailwind.css` (`@import "tailwindcss"`, `@import "shadcn/tailwind.css"`).
- Tokens en `:root` con **oklch** (shadcn) + variante `.dark`.
- Uso en layout/base (`@layer base`) y utilidades puntuales con `cn()`.
- **No sustituye** los módulos SCSS de las secciones principales.

### 3. CSS plano (casos puntuales)

- Componentes de terceros o legacy: `StaggeredMenu.css`, `Plasma.css`.
- Evitar CSS global nuevo salvo necesidad clara.

### 4. `globals.scss`

- Reset básico, variables de layout (`--site-sticky-nav-offset`), notas para Motion scroll.
- No es el lugar principal de estilos de sección.

### Regla práctica para el agente

| Contexto | Herramienta |
|----------|-------------|
| Secciones grandes (Hero, Projects, Team, Contact, Footer, WorkWithUs, Floating*) | **SCSS Module** |
| Layout shell, utilidades rápidas, shadcn | **Tailwind + `cn()`** |
| Animaciones complejas de menú/carrusel | **GSAP** en componente cliente |

---

## Sistema visual

Inspiración **Framer** — ver [`DESIGN.md`](./DESIGN.md) para la guía completa.

| Token | Valor | Uso |
|-------|--------|-----|
| Void Black | `#000000` | Fondo principal del sitio |
| Pure White | `#ffffff` | Texto en oscuro / bandas claras |
| Framer Blue | `#0099ff` | Acento interactivo (links, focus, rings) |
| Muted Silver | `#a6a6a6` (oscuro) / `#6a6a6a`–`#5c5c5c` (claro) | Texto secundario |
| Frosted | `rgba(255,255,255,0.1)` | Botones glass en oscuro |
| Blue ring | `rgba(0,153,255,0.15)` | Borde/sombra de elevación en cards oscuras |

### Tema light / dark

- `ThemeProvider` + cookie/`localStorage` (`site-theme` vía `themeCookie.ts`).
- Layout lee cookie en SSR; default **`light`**; clase `.dark` en `<html>` cuando corresponde.
- UI de toggle: `FloatingSettings` (móvil flotante; desktop inline en nav).
- Logo: átomo `ThemeLogo`.

### Bandas de contraste (implementación real)

- **Hero:** banda **clara** (`#ffffff`), texto `#252525`, acento `#0099ff`. Display con **Montserrat 700** (`--font-montserrat`), tracking negativo fuerte, uppercase.
- **Projects:** banda clara con transiciones de tema vía `@property` en SCSS; cyan/blue spots animados.
- **Resto del sitio:** predominio **negro absoluto** según DESIGN.md (respetar tema cuando aplique).
- **Botones:** pills (radius 40px–100px), CTAs blancos o invertidos según banda.

### Tipografía (`layout.tsx`)

- **Inter** → `--font-sans` (cuerpo/UI)
- **Geist** → `--font-geist-sans`
- **Montserrat 700** → `--font-montserrat` (titulares display)

---

## Arquitectura de componentes (Atomic Design)

```
src/app/page.tsx
  → HomePage (pages/)
    → HomeTemplate (templates/)
      → HomeHeroStack + AgencyStaggeredMenu + Hero
      → WorkWithUsSection (#trabajar-con-nosotros)   [dynamic]
      → ProjectsSection (#proyectos)                 [dynamic]
      → TeamSection (#equipo)                        [dynamic]
      → ContactSection (#contact)                    [dynamic]
      → SiteFooterReveal                             [dynamic]

AppProviders (layout)
  → ThemeProvider → I18nProvider → SmoothScrollProvider
  → FloatingContactCta (desktop)
  → FloatingSettings placement="floating" (mobile)
```

| Capa | Carpeta | Rol |
|------|---------|-----|
| Pages | `src/components/pages/` | Home, case study, legales |
| Templates | `src/components/templates/` | Orden de secciones de la landing |
| Organisms | `src/components/organisms/` | Bloques autónomos (incl. Floating*) |
| Atoms | `src/components/atoms/` | Piezas mínimas (p. ej. `ThemeLogo`) |
| Providers / Context | `src/components/providers/`, `src/contexts/` | Theme, i18n, scroll, overlay menú |
| Config | `src/config/` | Site SEO (`site.ts`), assets, tipos de nav/legales |
| i18n | `src/i18n/` | Traducciones, `content.ts` (datos localizados), locale store |
| Lib | `src/lib/` | `cn()`, scroll, email, SEO JSON-LD, projects by slug, tema |
| Emails | `emails/` | Plantillas React Email (inquiry + confirmation) |
| SEO | `src/components/seo/` | p. ej. `OrganizationJsonLd` |

**Alias:** `@/*` → `./src/*`

### Server vs Client

- Por defecto **Server Components**.
- `"use client"` solo si hay: estado, efectos, GSAP, Motion, WebGL, listeners DOM, theme/i18n hooks.
- Ejemplos cliente: `ProjectsSection`, `ContactScrollShell`, `SiteFooterReveal`, `AgencyStaggeredMenu`, `SmoothScrollProvider`, `ThemeProvider`, `I18nProvider`, `Plasma`, `HeroBeamsBackground`, Floating*.

---

## i18n

- Locales: **`es`** (default) y **`en`**.
- `I18nProvider` + `localeStore` (persistencia cliente); carga dinámica de `en`.
- Copy UI y datos derivados: `src/i18n/translations/{es,en}.ts` + helpers en `src/i18n/content.ts` (`getSiteNavItems`, `getPortfolioProjects`, `getTeamMembers`, `getWorkWithUsSteps`, opciones de contacto, etc.).
- Estructura/base no traducida (slugs, imágenes, tech stacks): `projectsData.ts` (`portfolioProjectsBase`), etc.
- Al editar textos visibles: preferir keys i18n, no hardcodear solo en español.

---

## Animaciones

| Librería | Dónde se usa |
|----------|----------------|
| **GSAP** | Menú staggered (`StaggeredMenu.jsx`), carrusel/scroll de Projects, WorkWithUs pin, `smoothScrollToHash` |
| **Motion** (`motion/react`) | Contact (scroll-driven), footer reveal/curtain |
| **OGL / WebGL** | `Plasma.tsx` en Hero |
| **Custom** | `HeroBeamsBackground`, `useFooterCurtainProgress`, `heroEntranceBoot` (script boot en layout) |

**Obligatorio:** comprobar `prefers-reduced-motion` antes de animar; degradar a estados estáticos.

---

## Datos y assets editables

| Contenido | Archivo |
|-----------|---------|
| Base proyectos (ids, images, tech, href) | `src/components/organisms/ProjectsSection/projectsData.ts` |
| Textos proyectos / case study | `src/i18n/translations/{es,en}.ts` vía `getPortfolioProjects` |
| Lookup por slug | `src/lib/projects/projectBySlug.ts` |
| Equipo (estructura) | `src/components/organisms/TeamSection/teamData.ts` + i18n |
| Nav / legales labels | `src/i18n/content.ts` + `src/config/site.ts` (`LEGAL_PATHS`) |
| Formulario (schema UI + Zod server) | `contactFormData.ts` + `src/lib/email/contactSchema.ts` |
| Site SEO / contacto | `src/config/site.ts` |
| Imágenes portfolio | `public/projects/` (resize: `public/projects/resize-imgs/`) |
| Imágenes equipo | `public/team/` |
| Proceso “trabajar con nosotros” | `public/work-with-us/` + `workWithUsSteps.ts` / i18n |

Al reemplazar capturas en `public/projects/`, subir versión de caché vía `publicAssetUrl` / constante en `projectsData.ts`.

---

## Contacto (API)

1. Formulario cliente → `POST /api/contact`.
2. Validación: `contactSchema` (Zod).
3. Envío: `sendContactSubmission` → Resend + templates en `emails/`.
4. Errores tipados: `validation_error`, `service_unavailable`, `send_failed`.

No exponer claves Resend al cliente; solo variables de servidor.

---

## Convenciones de código

Ver [`RULES.md`](./RULES.md). Resumen:

- TypeScript estricto — sin `any`; props tipadas.
- React funcional — composición, hooks para lógica.
- KISS / DRY — sin sobreingeniería.
- Nombres: `PascalCase` componentes, `useCamelCase` hooks, `UPPER_SNAKE` constantes globales.
- Imports al inicio del archivo (no inline imports).
- Accesibilidad: HTML semántico, `aria-label`, jerarquía de headings, foco visible.
- Commits Conventional Commits — solo si el usuario lo pide.
- Cambios mínimos y focalizados.
- Next 16: APIs/`params` async — no asumir patrones de Next 14/15; ver `AGENTS.md` y docs empaquetadas si existen.

---

## Componentes de terceros

- **StaggeredMenu:** JSX en `StaggeredMenu.jsx` + wrapper `AgencyStaggeredMenu.tsx` + CSS propio.
- **shadcn** con registros `@react-bits` y `@aceternity` en `components.json`.

---

## Navegación y scroll

- Anclas: `#inicio`, `#trabajar-con-nosotros`, `#proyectos`, `#equipo`, `#contact` (links como `/#...` desde `getSiteNavItems`).
- `SmoothScrollProvider` intercepta clicks en enlaces con hash.
- Menú abierto: evento `staggered-menu:close`, luego scroll (~340ms delay).
- Variable CSS `--site-sticky-nav-offset` para compensar nav sticky.
- CTA flotante desktop: `FloatingContactCta` → contacto.

---

## Secciones de la landing (orden)

1. Hero + menú staggered (`#inicio`)
2. Trabajar con nosotros (`#trabajar-con-nosotros`)
3. Proyectos (`#proyectos`) → detalle en `/proyectos/[slug]`
4. Equipo (`#equipo`)
5. Contacto (`#contact`)
6. Footer con efecto reveal

---

## Restricciones para el agente (NO hacer)

- No cambiar a npm/yarn sin pedirlo (el lock oficial es **pnpm**; puede existir `package-lock.json` residual — no usarlo como fuente de verdad).
- No meter estilos globales masivos si basta un `.module.scss`.
- No ignorar `DESIGN.md` (negro puro, Framer Blue solo en interactivos, pills en botones).
- No usar fondos grises cálidos en lugar de void black (salvo bandas documentadas).
- No poner `"use client"` en todo por defecto.
- No crear commits/PRs salvo que el usuario lo pida explícitamente.
- No asumir APIs de Next.js 14/15 — el proyecto es **Next 16**.
- Seguir estructura existente en `organisms/` / `pages/` / `i18n/`, no inventar capas paralelas sin necesidad.
- No hardcodear copy solo en un idioma si el string ya vive en i18n.
- No commitear `.env` ni API keys.

---

## Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [`DESIGN.md`](./DESIGN.md) | Guía visual completa |
| [`RULES.md`](./RULES.md) | Convenciones técnicas |
| [`../README.md`](../README.md) | Overview, scripts, env, personalización |
| [`../AGENTS.md`](../AGENTS.md) | Notas Next.js 16 del repo (si existe) |

---

## Prompt corto (copiar directo en Cursor)

```
Proyecto: GRG Solutions — Next.js 16 App Router, React 19, TS strict, pnpm.
Sitio: landing con anclas + /proyectos/[slug] + legales + POST /api/contact (Zod/Resend/React Email).
Estilos: SCSS Modules por sección (tokens $framer-blue, $pure-white) + Tailwind 4/shadcn para base. Diseño Framer (docs/DESIGN.md): void #000, acento #0099ff, pills, Montserrat display + Inter body. Hero/Projects banda clara; resto oscuro. Theme light/dark (ThemeProvider + cookie).
Arquitectura: page → HomePage → HomeTemplate (dynamic sections) → organisms. Providers: Theme + I18n + SmoothScroll. FloatingContactCta / FloatingSettings. "use client" solo con GSAP/Motion/WebGL/estado/hooks de tema-i18n.
i18n: es/en vía I18nProvider + src/i18n/translations + content.ts. Datos base en *Data.ts; copy en traducciones.
Animaciones: GSAP (menú, projects, scroll pin), Motion (contact, footer), prefers-reduced-motion obligatorio.
SEO: metadata en layout/rutas, OrganizationJsonLd, sitemap/robots.
Reglas: cambios mínimos, accesibilidad, sin commits salvo pedido, alias @/*, Next 16 async APIs.
Contexto completo: docs/PROMPT-CONTEXT.md
```

---

## Ejemplo de tarea típica

> Añadir un campo al formulario de contacto: actualizar `contactFormData.ts` + schema Zod + template React Email + keys en `es.ts`/`en.ts`, mantener validación en `/api/contact`, estilos en el `.module.scss` de Contact, sin romper theme/i18n ni `prefers-reduced-motion`.
