# 🌐 Agencia Web GRG

Landing corporativa de **Agencia Web GRG**: sitio de una sola página con identidad oscura, animaciones fluidas y secciones pensadas para mostrar portfolio, equipo y contacto.

Construido con **Next.js 16** (App Router), **React 19**, **TypeScript**, **SCSS Modules** y **Tailwind CSS 4**.

---

## ✨ Características

| Sección | Descripción |
|--------|-------------|
| 🎯 **Hero** | Titular de impacto, fondo con efectos visuales (beams / plasma) y CTA hacia contacto |
| 📂 **Proyectos** | Carrusel de portfolio con capturas, tecnologías y clientes nacionales e internacionales |
| 👥 **Equipo** | Presentación del equipo con animaciones y tipografía de display |
| 📬 **Contacto** | Formulario con servicio, presupuesto y plazos configurables |
| 🧭 **Navegación** | Menú staggered animado y anclas a `#inicio`, `#proyectos` y `#contact` |
| 🦶 **Footer** | Pie con efecto reveal / cortina al hacer scroll |

La experiencia prioriza rendimiento, accesibilidad básica (`aria-label`, semántica HTML) y un diseño inspirado en interfaces de producto de alto nivel (ver [`docs/DESIGN.md`](docs/DESIGN.md)).

---

## 🛠️ Stack tecnológico

- **[Next.js 16](https://nextjs.org/)** — App Router, optimización de imágenes y despliegue en Vercel
- **[React 19](https://react.dev/)** — Componentes y composición
- **[TypeScript 5](https://www.typescriptlang.org/)** — Tipado estático
- **[SCSS Modules](https://sass-lang.com/)** — Estilos por componente
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utilidades y tokens globales
- **[GSAP](https://gsap.com/)** / **[Motion](https://motion.dev/)** — Animaciones y microinteracciones
- **[Lucide React](https://lucide.dev/)** — Iconografía
- **[shadcn/ui](https://ui.shadcn.com/)** — Base de componentes UI (preset radix-vega)

---

## 📁 Estructura del proyecto

```
src/
├── app/                    # Rutas, layout global y estilos base
│   ├── page.tsx            # Entrada de la landing
│   ├── layout.tsx          # Fuentes, metadata y shell HTML
│   ├── globals.scss
│   └── tailwind.css
├── components/
│   ├── pages/              # Páginas (p. ej. HomePage)
│   ├── templates/          # Plantillas (HomeTemplate)
│   ├── organisms/            # Hero, Projects, Team, Contact, Footer, Menú
│   └── motion/             # Utilidades de animación (BlurText, etc.)
├── config/                 # Navegación, enlaces legales y sociales
└── lib/                    # Helpers (cn, utils)
public/
├── projects/               # Capturas del portfolio
├── team/                   # Fotos e ilustraciones del equipo
└── logo.svg
docs/
├── DESIGN.md               # Guía visual y sistema de diseño
└── RULES.md                # Convenciones de código y arquitectura
```

**Flujo de la página principal:** `page.tsx` → `HomePage` → `HomeTemplate` → organismos (`Hero`, `ProjectsSection`, `TeamSection`, `ContactSection`, `SiteFooterReveal`).

---

## 📋 Requisitos

- **[Node.js](https://nodejs.org/)** 20 o superior
- **[pnpm](https://pnpm.io/)** 10 o superior (gestor oficial del repositorio)

---

## 🚀 Instalación y desarrollo

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd Agencia-Web-GRG
pnpm install
```

### 2. Arrancar el servidor de desarrollo

```bash
pnpm dev
```

Abre **[http://localhost:3000](http://localhost:3000)** en el navegador.

### 3. Build de producción

```bash
pnpm build
pnpm start
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente |
| `pnpm build` | Compilación optimizada para producción |
| `pnpm start` | Servidor de producción (tras `build`) |
| `pnpm lint` | Análisis estático con ESLint |

---

## 🎨 Personalización rápida

| Qué cambiar | Dónde |
|-------------|--------|
| Proyectos del portfolio | `src/components/organisms/ProjectsSection/projectsData.ts` |
| Miembros del equipo | `src/components/organisms/TeamSection/teamData.ts` |
| Enlaces del menú y pie | `src/config/siteNavigation.ts` |
| Opciones del formulario | `src/components/organisms/ContactSection/contactFormData.ts` |
| Imágenes del portfolio | `public/projects/` |
| Calidad de imágenes Next | `next.config.ts` (`images.qualities`, `localPatterns`) |

Tras sustituir capturas en `public/projects/`, actualiza la constante `PROJECT_IMAGE_CACHE_VERSION` en `projectsData.ts` para invalidar la caché de `next/image`.

---

## 📚 Documentación interna

| Documento | Contenido |
|-----------|-----------|
| [`docs/RULES.md`](docs/RULES.md) | Principios SOLID, Atomic Design, TypeScript, React, Next.js, accesibilidad y checklist de calidad |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Paleta, tipografía, espaciado y reglas visuales (tema oscuro tipo producto premium) |
| [`AGENTS.md`](AGENTS.md) | Notas sobre **Next.js 16** en este repositorio (APIs y convenciones que pueden diferir de versiones anteriores) |

> **Nota:** Este proyecto usa Next.js 16 con cambios respecto a versiones previas. Antes de implementar rutas, caché o APIs nuevas, consulta la documentación empaquetada en `node_modules/next/dist/docs/`.

---

## ☁️ Despliegue

El despliegue recomendado es **[Vercel](https://vercel.com)**:

1. Conecta el repositorio en el dashboard de Vercel.
2. Framework preset: **Next.js** (detección automática).
3. Comando de build: `pnpm build` (o el equivalente si usas otro gestor en CI).
4. Variables de entorno: añádelas solo si integras servicios externos (formulario, analytics, etc.).

Guía oficial: [Deploying Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

---

## 🏗️ Arquitectura

El código sigue **Atomic Design** adaptado al App Router:

- **Pages** — Composición mínima por ruta
- **Templates** — Layout de secciones de la landing
- **Organisms** — Bloques autónomos (Hero, Projects, Team, Contact, Footer)
- **Motion / utilidades** — Piezas reutilizables de animación

Convenciones detalladas, nombres de archivos, formularios, SEO y rendimiento: [`docs/RULES.md`](docs/RULES.md).

---

## 🤝 Contribución

1. Crea una rama desde `main` (`feature/nombre-corto`).
2. Respeta las guías en `docs/RULES.md` y `docs/DESIGN.md`.
3. Ejecuta `pnpm lint` y verifica la landing en local antes de abrir un PR.
4. Describe el cambio con contexto y capturas si afecta a la UI.

---

## 📄 Licencia

Proyecto **privado** (`"private": true` en `package.json`). Todos los derechos reservados salvo acuerdo explícito con Agencia Web GRG.

---

<p align="center">
  Hecho con dedicación por <strong>Agencia Web GRG</strong> · Experiencias web de alto nivel
</p>
