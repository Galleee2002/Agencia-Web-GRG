"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  projects,
  type ClientScope,
  type ProjectItem,
} from "./projectsData";
import styles from "./ProjectsSection.module.scss";

/** Debe coincidir con `$carousel-breakpoint` en `ProjectsSection.module.scss`. */
const CAROUSEL_MIN_WIDTH_PX = 1200;

function scopeLabel(scope: ClientScope): string {
  return scope === "national" ? "Nacional" : "Internacional";
}

function ProjectCard({
  project,
  titleId,
}: {
  project: ProjectItem;
  titleId: string;
}) {
  return (
    <article className={styles.card} aria-labelledby={titleId}>
      <div className={styles.media}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
            fill
            sizes="(min-width: 1200px) 80vw, 100vw"
          />
        ) : (
          <div className={styles.mediaPlaceholder} aria-hidden />
        )}
      </div>
      <div className={styles.body}>
        <h3 id={titleId} className={styles.title}>
          {project.name}
        </h3>
        <p className={styles.description}>{project.description}</p>
        <span className={styles.scope}>{scopeLabel(project.clientScope)}</span>
        <Link
          href={project.href}
          className={styles.cta}
          aria-label={`Ver más sobre ${project.name}`}
        >
          Ver más
        </Link>
      </div>
    </article>
  );
}

export function ProjectsSection() {
  const baseId = useId().replace(/:/g, "");
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  /** SSR + primer paint cliente: ambos bloques (coincide con el HTML previo). Luego solo el activo. */
  const [layoutMode, setLayoutMode] = useState<"both" | "stack" | "carousel">(
    "both",
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${CAROUSEL_MIN_WIDTH_PX}px)`,
    );
    const apply = () => {
      setLayoutMode(mq.matches ? "carousel" : "stack");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showStack = layoutMode === "both" || layoutMode === "stack";
  const showCarousel = layoutMode === "both" || layoutMode === "carousel";

  const updateIndex = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    if (w <= 0) return;
    const idx = Math.round(el.scrollLeft / w);
    setActiveIndex(
      Math.min(Math.max(0, idx), Math.max(0, projects.length - 1)),
    );
  }, []);

  useEffect(() => {
    if (!showCarousel) return;
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndex, { passive: true });
    window.addEventListener("resize", updateIndex);
    updateIndex();
    return () => {
      el.removeEventListener("scroll", updateIndex);
      window.removeEventListener("resize", updateIndex);
    };
  }, [updateIndex, showCarousel]);

  const goTo = useCallback((index: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const len = projects.length;
    if (len === 0 || w <= 0) return;
    const clamped = Math.min(Math.max(0, index), len - 1);
    const instant =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: clamped * w,
      behavior: instant ? "auto" : "smooth",
    });
  }, []);

  /** Desde el último slide, “siguiente” vuelve al primero (sin bloquear el botón). */
  const goNext = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const len = projects.length;
    if (len === 0 || w <= 0) return;
    const next = (activeIndex + 1) % len;
    const wrapsToStart = len > 1 && activeIndex === len - 1;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Del último al primero: sin animación larga hacia atrás por todo el carrusel
    el.scrollTo({
      left: next * w,
      behavior: prefersReduced || wrapsToStart ? "auto" : "smooth",
    });
  }, [activeIndex]);

  return (
    <section
      id="proyectos"
      className={styles.section}
      aria-labelledby="projects-heading"
    >
      <div className={styles.gradientEdge} aria-hidden>
        <div className={styles.gradientEdgeWash} />
        <div className={styles.gradientEdgeBlur} />
      </div>
      <div className={styles.innerTop}>
        <h2 id="projects-heading" className={styles.heading}>
          Proyectos
        </h2>
      </div>

      {showStack ? (
        <div className={styles.stack}>
          {projects.map((project, i) => (
            <ProjectCard
              key={`${project.name}-${i}`}
              project={project}
              titleId={`project-${baseId}-stack-${i}`}
            />
          ))}
        </div>
      ) : null}

      {showCarousel ? (
        <div
          className={styles.carouselRegion}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Proyectos destacados"
        >
          <p id={`${baseId}-carousel-hint`} className={styles.visuallyHidden}>
            Usa los botones anterior y siguiente, los indicadores o el desplazamiento horizontal para ver cada proyecto.
          </p>
          <div className={styles.carouselShell}>
            <div
              ref={viewportRef}
              className={styles.viewport}
              tabIndex={0}
              aria-describedby={`${baseId}-carousel-hint`}
            >
              {projects.map((project, i) => (
                <div
                  key={`${project.name}-slide-${i}`}
                  className={styles.slide}
                >
                  <ProjectCard
                    project={project}
                    titleId={`project-${baseId}-carousel-${i}`}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex <= 0}
              aria-label="Proyecto anterior"
            >
              <ChevronLeft size={22} aria-hidden />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={goNext}
              aria-label={
                projects.length > 1 && activeIndex >= projects.length - 1
                  ? "Volver al primer proyecto"
                  : "Proyecto siguiente"
              }
            >
              <ChevronRight size={22} aria-hidden />
            </button>
          </div>

          <div className={styles.dots} aria-label="Seleccionar proyecto">
            {projects.map((project, i) => (
              <button
                key={`dot-${project.name}-${i}`}
                type="button"
                aria-label={`Mostrar proyecto: ${project.name}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
