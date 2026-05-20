# Contexto para prompts (Cursor / ChatGPT)

Brief reutilizable del proyecto **Agencia Web GMG**. Úsalo para generar prompts concisos para un agente de código en Cursor.

---

## Instrucción para ChatGPT

> Genera un **prompt conciso en español** (máx. ~800 palabras) para un agente de código en **Cursor** que trabaje en este repositorio. El prompt debe incluir: stack, arquitectura, reglas de estilos, sistema visual, animaciones, convenciones de código y restricciones. No inventes tecnologías ni patrones que no estén listados abajo. Prioriza instrucciones accionables (“haz X”, “no hagas Y”). El agente implementará UI en una landing de una sola página.

---

## Qué es el proyecto

- **Nombre:** Agencia Web GMG (README también menciona “GRG”).
- **Tipo:** Landing corporativa de **una sola página** (SPA-style con anclas).
- **Idioma UI:** Español (`lang="es"`).
- **Objetivo:** Portfolio, equipo, proceso de trabajo, contacto; estética premium tipo producto (inspiración Framer).
- **Repo:** `Agencia-Web-GMG-1` — proyecto privado, despliegue pensado en **Vercel**.

---

## Stack tecnológico

| Tecnología | Versión / nota |
|------------|----------------|
| **Next.js** | 16.2.4 — App Router (`src/app/`) |
| **React** | 19.2.4 |
| **TypeScript** | 5.x — `strict: true` |
| **Gestor** | **pnpm** 10.33.0 |
| **Tailwind CSS** | 4.2.4 — utilidades + tokens shadcn |
| **SCSS** | Sass 1.99 — **CSS Modules** (`.module.scss`) como estilo principal por componente |
| **shadcn/ui** | v4 — preset `radix-vega`, iconos **Lucide** |
| **Animación** | **GSAP** 3.13 (menú, proyectos, scroll) + **Motion** (`motion/react`) en contacto y footer |
| **WebGL / efectos** | `ogl` (Plasma), componentes custom (beams) |
| **Utilidades CSS** | `clsx` + `tailwind-merge` → helper `cn()` en `@/lib/utils` |
| **Imágenes** | `next/image` con `qualities: [72, 75]` y `localPatterns` en `next.config.ts` |

**Scripts:** `pnpm dev` | `pnpm build` | `pnpm start` | `pnpm lint`

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
| Secciones grandes (Hero, Projects, Team, Contact, Footer, WorkWithUs) | **SCSS Module** |
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

### Bandas de contraste (implementación real)

- **Hero:** banda **clara** (`#ffffff`), texto `#252525`, acento `#0099ff`. Display con **Montserrat 700** (`--font-montserrat`), tracking negativo fuerte, uppercase.
- **Projects:** banda clara con transiciones de tema vía `@property` en SCSS; cyan/blue spots animados.
- **Resto del sitio:** predominio **negro absoluto** según DESIGN.md.
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
      → WorkWithUsSection (#trabajar-con-nosotros)
      → ProjectsSection (#proyectos)
      → TeamSection
      → ContactSection (#contact)
      → SiteFooterReveal
```

| Capa | Carpeta | Rol |
|------|---------|-----|
| Pages | `src/components/pages/` | Composición mínima por ruta |
| Templates | `src/components/templates/` | Orden de secciones de la landing |
| Organisms | `src/components/organisms/` | Bloques autónomos |
| Providers / Context | `src/components/providers/`, `src/contexts/` | Scroll suave, overlay menú |
| Config | `src/config/` | Navegación, legales, sociales |
| Lib | `src/lib/` | `cn()`, `smoothScroll.ts` |

**Alias:** `@/*` → `./src/*`

### Server vs Client

- Por defecto **Server Components**.
- `"use client"` solo si hay: estado, efectos, GSAP, Motion, WebGL, listeners DOM.
- Ejemplos cliente: `ProjectsSection`, `ContactScrollShell`, `SiteFooterReveal`, `AgencyStaggeredMenu`, `SmoothScrollProvider`, `Plasma`, `HeroBeamsBackground`.

---

## Animaciones

| Librería | Dónde se usa |
|----------|----------------|
| **GSAP** | Menú staggered (`StaggeredMenu.jsx`), carrusel/scroll de Projects, `smoothScrollToHash` |
| **Motion** (`motion/react`) | Contact (scroll-driven), footer reveal/curtain |
| **OGL / WebGL** | `Plasma.tsx` en Hero |
| **Custom** | `HeroBeamsBackground`, hooks como `useFooterCurtainProgress` |

**Obligatorio:** comprobar `prefers-reduced-motion` antes de animar; degradar a estados estáticos.

---

## Datos y assets editables

| Contenido | Archivo |
|-----------|---------|
| Proyectos portfolio | `src/components/organisms/ProjectsSection/projectsData.ts` |
| Equipo | `src/components/organisms/TeamSection/teamData.ts` |
| Menú / anclas | `src/config/siteNavigation.ts` |
| Formulario contacto | `src/components/organisms/ContactSection/contactFormData.ts` |
| Imágenes portfolio | `public/projects/` |
| Imágenes equipo | `public/team/` |
| Proceso “trabajar con nosotros” | `public/work-with-us/` (`idea.png`, `plan.png`, `entrega.png`) |

Al reemplazar capturas en `public/projects/`, subir `PROJECT_IMAGE_CACHE_VERSION` en `projectsData.ts`.

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

---

## Componentes de terceros

- **StaggeredMenu:** JSX en `StaggeredMenu.jsx` + wrapper `AgencyStaggeredMenu.tsx` + CSS propio.
- **shadcn** con registros `@react-bits` y `@aceternity` en `components.json`.

---

## Navegación y scroll

- Anclas: `#inicio`, `#trabajar-con-nosotros`, `#proyectos`, `#contact`.
- `SmoothScrollProvider` intercepta clicks en enlaces con hash.
- Menú abierto: evento `staggered-menu:close`, luego scroll (~340ms delay).
- Variable CSS `--site-sticky-nav-offset` para compensar nav sticky.

---

## Secciones de la landing (orden)

1. Hero + menú staggered (`#inicio`)
2. Trabajar con nosotros (`#trabajar-con-nosotros`)
3. Proyectos (`#proyectos`)
4. Equipo
5. Contacto (`#contact`)
6. Footer con efecto reveal

---

## Restricciones para el agente (NO hacer)

- No cambiar a npm/yarn sin pedirlo.
- No meter estilos globales masivos si basta un `.module.scss`.
- No ignorar `DESIGN.md` (negro puro, Framer Blue solo en interactivos, pills en botones).
- No usar fondos grises cálidos en lugar de void black (salvo bandas documentadas).
- No poner `"use client"` en todo por defecto.
- No crear commits/PRs salvo que el usuario lo pida explícitamente.
- No asumir APIs de Next.js 14/15 — el proyecto es **Next 16**.
- Seguir estructura existente en `organisms/`, no inventar capas paralelas sin necesidad.

---

## Documentación relacionada

| Documento | Contenido |
|-----------|-----------|
| [`DESIGN.md`](./DESIGN.md) | Guía visual completa |
| [`RULES.md`](./RULES.md) | Convenciones técnicas |
| [`../README.md`](../README.md) | Overview, scripts, personalización |

---

## Prompt corto (copiar directo en Cursor)

```
Proyecto: landing Agencia Web GMG — Next.js 16 App Router, React 19, TS strict, pnpm.
Estilos: SCSS Modules por sección (tokens $framer-blue, $pure-white en .module.scss) + Tailwind 4/shadcn para base. Diseño Framer-inspired (docs/DESIGN.md): void #000, acento #0099ff, pills, Montserrat display + Inter body. Hero y Projects en banda clara; resto oscuro.
Arquitectura: page → HomePage → HomeTemplate → organisms. "use client" solo con GSAP/Motion/WebGL/estado.
Animaciones: GSAP (menú, projects, scroll), Motion (contact, footer), prefers-reduced-motion obligatorio.
Datos: projectsData.ts, teamData.ts, siteNavigation.ts, contactFormData.ts. Imágenes en public/.
Reglas: cambios mínimos, español UI, accesibilidad, sin commits salvo pedido, alias @/*.
Contexto completo: docs/PROMPT-CONTEXT.md
```

---

## Ejemplo de tarea típica

> Implementar la sección Work With Us con 3 pasos (idea, plan, entrega), imágenes en `public/work-with-us/`, estilos en `WorkWithUsSection.module.scss` siguiendo tokens Framer, coherente con la banda visual de la sección, sin romper el orden en `HomeTemplate`, respetando `prefers-reduced-motion`.
