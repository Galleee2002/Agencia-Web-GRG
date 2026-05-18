# Agencia Web GMG

Landing de la agencia construida con Next.js 16 (App Router), React 19, TypeScript y SCSS modules.

## Requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+ (gestor oficial del proyecto)

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

La página principal está en `src/app/page.tsx` y compone la landing vía `HomePage` → `HomeTemplate`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | ESLint |

## Documentación del proyecto

- [`docs/RULES.md`](docs/RULES.md) — convenciones de código y arquitectura
- [`docs/DESIGN.md`](docs/DESIGN.md) — guía visual
- [`AGENTS.md`](AGENTS.md) — notas sobre Next.js 16 en este repo

## Deploy

Despliegue recomendado en [Vercel](https://vercel.com). Ver [documentación de Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
