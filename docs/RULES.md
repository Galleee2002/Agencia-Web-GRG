# Reglas del proyecto

Normas técnicas, arquitectónicas y de estilo para el desarrollo. Complementa la guía visual en [`DESIGN.md`](./DESIGN.md). Para convenciones específicas de la versión de Next.js del repo, revisa [`AGENTS.md`](../AGENTS.md) y la documentación empaquetada en `node_modules/next/dist/docs/`.

**Stack:** Next.js · TypeScript · React · SCSS (módulos)

## Índice

1. [Principios generales](#1-principios-generales)
2. [KISS](#2-kiss)
3. [DRY](#3-dry)
4. [Clean Code](#4-clean-code)
5. [TypeScript](#5-typescript)
6. [React](#6-react)
7. [Next.js](#7-nextjs)
8. [SCSS](#8-scss)
9. [Atomic Design](#9-atomic-design)
10. [Modularización](#10-modularización)
11. [Buenas prácticas](#11-buenas-prácticas)
12. [Formularios](#12-formularios)
13. [Rendimiento](#13-rendimiento)
14. [Accesibilidad](#14-accesibilidad)
15. [SEO](#15-seo)
16. [Convenciones de nombres](#16-convenciones-de-nombres)
17. [Commits](#17-commits)
18. [Pull requests](#18-pull-requests)
19. [Componentes](#19-componentes)
20. [Hooks](#20-hooks)
21. [Servicios](#21-servicios)
22. [Variables de entorno](#22-variables-de-entorno)
23. [Seguridad](#23-seguridad)
24. [Testing](#24-testing)
25. [Checklist antes de cerrar](#25-checklist-antes-de-cerrar)

---

## 1. Principios generales

### SOLID (resumen práctico)

| Principio | En la práctica |
|-----------|----------------|
| **S**ingle responsibility | Un módulo, componente o función hace una cosa bien definida. |
| **O**pen/closed | Extender con composición o nuevas piezas; evitar tocar núcleos estables sin necesidad. |
| **L**iskov | Los subtipos y variantes de componente no deben romper el contrato esperado por quien los usa. |
| **I**nterface segregation | Tipos y props pequeños; evitar “objetos dios” en APIs públicas. |
| **D**ependency inversion | Depender de interfaces y datos tipados, no de detalles de implementación concretos. |

---

## 2. KISS

- Sin sobreingeniería ni capas “por si acaso”.
- Abstracciones solo cuando ya existe duplicación real o un límite claro (API, UI, dominio).
- Funciones cortas y flujo legible de arriba a abajo.

---

## 3. DRY

No repetir lógica. Centralizar en:

- `hooks/` — estado y efectos reutilizables
- `utils/` — funciones puras
- `services/` — integraciones externas
- Constantes tipadas o enums según el caso

---

## 4. Clean Code

- **Nombres:** claros, descriptivos, sin abreviaturas crípticas.
- **Funciones:** cortas, una responsabilidad, pocos argumentos cuando sea posible.
- **JSX:** poca lógica en el render; extraer helpers o hooks.
- **Código muerto:** eliminar imports, componentes y estilos no usados.

---

## 5. TypeScript

- Evitar `any`; usar `unknown` y acotar con type guards cuando el origen no sea fiable.
- Tipar siempre las props de componentes y el retorno de funciones públicas.
- Tipos compartidos en `types/` (o colocalizados si solo sirven a un feature pequeño).
- Preferir `type` para uniones y mapeos; `interface` para objetos que se extienden en capas.
- Mantener el modo estricto del proyecto; no relajar `tsconfig` salvo decisión documentada.

---

## 6. React

- Solo componentes funcionales.
- Composición sobre herencia.
- Lógica reutilizable en hooks; UI en componentes.
- Evitar componentes monolíticos; dividir por responsabilidad y legibilidad.
- Props explícitas y mínimas; evitar pasar objetos enormes sin necesidad.

---

## 7. Next.js

- **App Router** (`src/app/`).
- **Server Components por defecto**; `"use client"` solo cuando haya estado del cliente, efectos del navegador o APIs que lo exijan.
- Separar la página (`page.tsx`) de piezas de UI reutilizables en `components/` o `features/`.
- Rutas, metadata y convenciones: seguir la guía de la versión instalada (ver `AGENTS.md`).

---

## 8. SCSS

- Estilos con **CSS Modules** (`.module.scss`).
- Anidación moderada (evitar especificidad difícil de mantener).
- Variables, mixins y tokens alineados con [`DESIGN.md`](./DESIGN.md) cuando aplique.
- Nombres de clases BEM-like o consistentes con el resto del proyecto.

---

## 9. Atomic Design

| Nivel | Ejemplos |
|-------|----------|
| Átomos | `Button`, `Input`, `Text` |
| Moléculas | `SearchBar`, `FormField` |
| Organismos | `Header`, `ProductCard` |
| Templates | layouts de página |
| Pages | composición en `page.tsx` / rutas |

Los límites son orientativos: lo importante es coherencia y reuso, no forzar cada pieza en una casilla.

---

## 10. Modularización

Estructura orientativa (ajustar al repo real):

```text
src/
  app/
  components/
  features/
  hooks/
  services/
  utils/
  types/
  styles/
```

Colocar código nuevo lo más cerca posible de quien lo usa; subir a carpetas compartidas solo cuando haya segundo consumidor.

---

## 11. Buenas prácticas

- Separar responsabilidades entre capas (UI, datos, dominio ligero).
- Constantes y configuración en un solo lugar cuando se repitan.
- Errores: manejo explícito, mensajes útiles al usuario, logging acorde al entorno.
- Validar y tipar datos que vengan de red, formularios o query params.

---

## 12. Formularios

- Validación separada del markup (esquemas, funciones o librería acordada en el proyecto).
- Mensajes de error claros, asociados al campo (`aria-describedby` cuando corresponda).
- Estados de carga y deshabilitado del envío para evitar dobles envíos.

---

## 13. Rendimiento

- Imágenes con `next/image` cuando aporte optimización y control de layout.
- Evitar renders innecesarios (estructura de estado, memoización solo con evidencia de coste).
- Code splitting y lazy loading donde mejore la carga inicial sin complicar el flujo.

---

## 14. Accesibilidad

- HTML semántico (`main`, `nav`, `heading` jerárquico).
- Texto alternativo en imágenes informativas; `alt=""` solo si son puramente decorativas.
- Labels asociados a controles; no depender solo del placeholder.
- Teclado: orden de foco lógico, estados `:focus-visible`, modales con foco atrapado cuando aplique.
- Contraste y tamaños alineados con [`DESIGN.md`](./DESIGN.md).

---

## 15. SEO

- Metadata por ruta (`metadata` / `generateMetadata` según la API de la versión en uso).
- URLs legibles y estables.
- `robots.txt` y sitemap cuando el sitio esté indexable.

---

## 16. Convenciones de nombres

| Qué | Convención |
|-----|-------------|
| Componentes y tipos React | `PascalCase` |
| Hooks | `use` + `CamelCase` |
| Constantes globales | `UPPER_SNAKE_CASE` |
| Carpetas de features y rutas | `kebab-case` |

---

## 17. Commits

Mensajes en estilo [Conventional Commits](https://www.conventionalcommits.org/) (una línea, imperativo en español o inglés, consistente en el equipo):

```text
feat: descripción breve del cambio
fix: corrección concreta
refactor: sin cambio de comportamiento observable
docs: solo documentación
style: formato o estilos sin lógica
test: pruebas
chore: tareas de tooling, CI, deps
```

Cambios que rompen compatibilidad: indicarlo en el cuerpo del commit o con `BREAKING CHANGE:` según el flujo del proyecto.

---

## 18. Pull requests

- Descripción del **qué** y el **porqué**.
- Pasos para **probar** manualmente o comandos relevantes.
- Capturas o grabación corta si hay cambio visual.

---

## 19. Componentes

- Props tipadas; componentes enfocados en una responsabilidad.
- Estilos encapsulados en módulos SCSS (o el sistema acordado).
- Sin efectos secundarios ocultos fuera de lo esperado por el nombre del componente.

---

## 20. Hooks

- Prefijo obligatorio `use`.
- Reutilización de lógica, no de UI.
- Dependencias de `useEffect` / `useMemo` / `useCallback` correctas y revisadas.

---

## 21. Servicios

Encapsular integraciones externas (APIs REST/GraphQL, email, pagos, etc.):

- Una superficie clara (funciones o clase delgada).
- Errores de red y timeouts tratados de forma uniforme donde tenga sentido.

---

## 22. Variables de entorno

- No commitear secretos ni `.env` con datos sensibles.
- Variables críticas validadas al arranque o en un módulo de configuración tipado.
- Prefijos `NEXT_PUBLIC_` solo para valores que deben exponerse al cliente.

---

## 23. Seguridad

- Entradas sanitizadas o validadas antes de persistir o renderizar como HTML rico.
- No filtrar stack traces ni detalles internos al usuario final en producción.
- Cabeceras y políticas de seguridad según lo definido en despliegue (CSP, etc.).

---

## 24. Testing

Priorizar donde hay lógica o contratos frágiles:

- Utilidades y transformaciones de datos.
- Hooks con reglas de negocio.
- Servicios (mocks de red cuando aplique).

---

## 25. Checklist antes de cerrar

- [ ] El proyecto compila sin errores.
- [ ] Sin errores de TypeScript en archivos tocados.
- [ ] Sin código, estilos ni dependencias muertas añadidas por descuido.
- [ ] Criterios de SOLID / DRY / KISS razonablemente cumplidos para el alcance del cambio.
- [ ] Si hay UI: contraste, foco y semántica revisados al menos de forma básica.

---

## Regla final

El código debe ser **claro**, **tipado**, **modular**, **escalable** y **mantenible** — preferir legibilidad hoy sobre optimización prematura.
