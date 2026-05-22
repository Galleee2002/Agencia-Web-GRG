# Lighthouse baseline

## Antes (informe del usuario)

| Métrica | Puntuación |
|---------|------------|
| Performance | 68 |
| Accessibility | 85 |
| Best Practices | 81 |
| SEO | 100 |

## Después (prod local, móvil, `pnpm build && pnpm start`)

Ejecutar: `npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=docs/lighthouse-baseline/mobile-after.json`

Ver puntuaciones: `node -e "const r=require('./docs/lighthouse-baseline/mobile-after.json'); Object.entries(r.categories).forEach(([k,v])=>console.log(k, Math.round(v.score*100)))"`

Última corrida local headless (referencia, no sustituye auditoría en Chrome contra tu deploy):

| Métrica | Puntuación |
|---------|------------|
| Performance | ~41* |
| Accessibility | 87 |
| Best Practices | 100 |
| SEO | 100 |

\* La corrida local mostró LCP inflado (~27s); validar en Chrome DevTools contra `pnpm build && pnpm start` o producción. La ruta `/` pasó de dinámica a **estática** tras quitar `cookies()` del layout.

## Checklist visual

Hero, menú, Work With Us, proyectos (+ lightbox), equipo, contacto, footer, tema claro/oscuro, idioma ES/EN.
