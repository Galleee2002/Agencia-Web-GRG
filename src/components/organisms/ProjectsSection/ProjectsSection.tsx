"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import {
  clientLabel,
  portfolioProjects,
  type PortfolioProject,
} from "./projectsData";
import styles from "./ProjectsSection.module.scss";

/** Texto visible del h2; el troceo por carácter es solo visual (SplitText-style sin plugin Club). */
const PROJECTS_HEADING_PREFIX = "Todo proyecto exitoso comienza con una ";
const PROJECTS_HEADING_GRADIENT = "simple idea";
const PROJECTS_HEADING_FULL = `${PROJECTS_HEADING_PREFIX}${PROJECTS_HEADING_GRADIENT}.`;

type HeadingChar = { char: string; gradient: boolean };

type HeadingWord = { key: string; chars: HeadingChar[] };

function isGradientCharInWord(word: string, char: string): boolean {
  if (word === "simple") {
    return true;
  }
  if (word === "idea." || word === "idea") {
    return char !== ".";
  }
  return false;
}

function buildHeadingWords(): HeadingWord[] {
  const normalized = PROJECTS_HEADING_FULL.trimEnd();
  const tokens = normalized.split(/\s+/);
  return tokens.map((word, index) => ({
    key: `w-${index}-${word}`,
    chars: [...word].map((char) => ({
      char,
      gradient: isGradientCharInWord(word, char),
    })),
  }));
}

const GalleryImage = memo(function GalleryImage({
  src,
  alt,
  className,
  onOpenLightbox,
}: {
  src: string;
  alt: string;
  className?: string;
  onOpenLightbox?: () => void;
}) {
  if (!src) {
    return (
      <div
        className={clsx(styles.imagePlaceholder, className)}
        role="img"
        aria-label={alt}
      />
    );
  }
  return (
    <div
      role="button"
      tabIndex={0}
      data-gallery-image
      className={clsx(styles.imageFrame, className)}
      onClick={(e) => {
        e.stopPropagation();
        onOpenLightbox?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenLightbox?.();
        }
      }}
      aria-label={`Ampliar: ${alt}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        decoding="async"
        quality={72}
        sizes="(max-width: 899px) 92vw, (max-width: 1199px) 42vw, 38vw"
        className={styles.imageCover}
      />
    </div>
  );
});

const GALLERY_SLICES = 3;

const ShowcaseCard = memo(function ShowcaseCard({
  project,
  headingId,
}: {
  project: PortfolioProject;
  headingId: string;
}) {
  const titleId = `${headingId}-project-${project.id}`;
  const [a, b, c] = project.images;
  const baseAlt = `Captura del proyecto ${project.name}`;
  const imageSlots = useMemo(() => [a, b, c], [a, b, c]);

  const [detailsCompact, setDetailsCompact] = useState(false);
  const [overlayHidden, setOverlayHidden] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxLabelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(((index % GALLERY_SLICES) + GALLERY_SLICES) % GALLERY_SLICES);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goLightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + GALLERY_SLICES) % GALLERY_SLICES);
  }, []);

  const goLightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % GALLERY_SLICES);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      lightboxCloseRef.current?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goLightboxPrev();
      if (e.key === "ArrowRight") goLightboxNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeLightbox, goLightboxNext, goLightboxPrev, lightboxOpen]);

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-details-card]")) return;
      if (t.closest("[data-gallery-image]")) return;
      if (!detailsCompact) {
        setDetailsCompact(true);
        return;
      }
      if (!overlayHidden) {
        setOverlayHidden(true);
      }
    },
    [detailsCompact, overlayHidden],
  );

  const expandDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsCompact(false);
    setOverlayHidden(false);
  }, []);

  const currentLightboxSrc = imageSlots[lightboxIndex] ?? "";
  const currentLightboxAlt = `${baseAlt} — ${
    ["vista principal", "detalle 1", "detalle 2"][lightboxIndex] ?? "imagen"
  }`;

  const lightboxModal =
    mounted && lightboxOpen
      ? createPortal(
      <div className={styles.lightboxRoot}>
        <button
          type="button"
          className={styles.lightboxBackdrop}
          aria-label="Cerrar galería"
          onClick={closeLightbox}
        />
        <div
          className={styles.lightboxDialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby={lightboxLabelId}
        >
          <p id={lightboxLabelId} className={styles.visuallyHidden}>
            Galería de imágenes: {project.name}
          </p>
          <button
            ref={lightboxCloseRef}
            type="button"
            className={styles.lightboxClose}
            aria-label="Cerrar"
            onClick={closeLightbox}
          >
            <X size={22} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            className={clsx(styles.lightboxNav, styles.lightboxNavPrev)}
            aria-label="Imagen anterior"
            onClick={goLightboxPrev}
          >
            <ChevronLeft size={28} strokeWidth={2} aria-hidden />
          </button>
          <div className={styles.lightboxStage}>
            {currentLightboxSrc ? (
              <Image
                src={currentLightboxSrc}
                alt={currentLightboxAlt}
                fill
                sizes="(max-width: 1200px) 85vw, 1040px"
                className={styles.lightboxImg}
                priority
              />
            ) : (
              <div className={styles.lightboxEmpty} role="img" aria-label={currentLightboxAlt} />
            )}
          </div>
          <button
            type="button"
            className={clsx(styles.lightboxNav, styles.lightboxNavNext)}
            aria-label="Imagen siguiente"
            onClick={goLightboxNext}
          >
            <ChevronRight size={28} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>,
      document.body,
    )
  : null;

  return (
    <article
      className={styles.showcase}
      aria-labelledby={titleId}
      data-overlay-hidden={overlayHidden ? "true" : undefined}
    >
      <div className={styles.showcaseStage} onClick={handleStageClick}>
        <div className={styles.gallery}>
          <GalleryImage
            src={a}
            alt={`${baseAlt} — vista principal`}
            className={styles.galleryMain}
            onOpenLightbox={() => openLightbox(0)}
          />
          <div className={styles.galleryStack}>
            <GalleryImage
              src={b}
              alt={`${baseAlt} — detalle 1`}
              className={styles.gallerySecondary}
              onOpenLightbox={() => openLightbox(1)}
            />
            <GalleryImage
              src={c}
              alt={`${baseAlt} — detalle 2`}
              className={styles.gallerySecondary}
              onOpenLightbox={() => openLightbox(2)}
            />
          </div>
        </div>
        <div className={styles.overlayGradient} aria-hidden />
        <div className={styles.overlaySlot}>
          <div
            data-details-card
            className={clsx(
              styles.detailsCard,
              detailsCompact && styles.detailsCardCompact,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {detailsCompact ? (
              <div className={styles.detailsCompactBar}>
                <button
                  type="button"
                  className={styles.expandDetailsBtn}
                  onClick={expandDetails}
                  aria-expanded={!detailsCompact}
                  aria-controls={titleId}
                  aria-label="Mostrar detalles del proyecto"
                >
                  <PanelLeftOpen size={22} strokeWidth={2} aria-hidden />
                </button>
                <h3 id={titleId} className={styles.projectNameCompact}>
                  {project.name}
                </h3>
              </div>
            ) : (
              <>
                <p className={styles.featuredLabel}>
                  <span className={styles.featuredStar} aria-hidden>
                    ★
                  </span>{" "}
                  Proyecto destacado
                </p>
                <h3 id={titleId} className={styles.projectName}>
                  {project.name}
                </h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <p className={styles.clientLine}>
                  <Globe
                    className={styles.clientIcon}
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span>Tipo de cliente: {clientLabel(project.clientType)}</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      {lightboxModal}
    </article>
  );
});

function useProjectsScrollPerf(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let scrollEndTimer = 0;
    let scrolling = false;

    const setScrolling = (value: boolean) => {
      if (scrolling === value) return;
      scrolling = value;
      if (value) {
        section.setAttribute("data-scrolling", "true");
      } else {
        section.removeAttribute("data-scrolling");
      }
    };

    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(scrollEndTimer);
      scrollEndTimer = window.setTimeout(() => setScrolling(false), 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(scrollEndTimer);
      setScrolling(false);
    };
  }, [sectionRef]);
}

export function ProjectsSection() {
  const baseId = useId().replace(/:/g, "");
  const sectionRef = useRef<HTMLElement>(null);
  const projects = portfolioProjects;
  const count = projects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headingWords = useMemo(() => buildHeadingWords(), []);

  useProjectsScrollPerf(sectionRef);

  const active = useMemo(
    () => projects[Math.min(activeIndex, count - 1)] ?? projects[0],
    [activeIndex, projects, count],
  );

  useLayoutEffect(() => {
    const root = headingRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      const split = root.querySelector<HTMLElement>("[data-title-split]");
      if (!split) return;

      gsap.from(split, {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  const headingId = "projects-heading";

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + count) % count);
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % count);
  };

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      className={styles.section}
      aria-labelledby={headingId}
      data-project-theme={active.themeId}
    >
      <div className={styles.shell}>
        <div className={styles.sliderBleed}>
          <div
            className={styles.slider}
            role="region"
            aria-roledescription="carrusel"
            aria-label="Proyectos destacados"
          >
            <button
              type="button"
              className={styles.arrow}
              onClick={goPrev}
              aria-label="Ver proyecto anterior"
            >
              <ChevronLeft size={26} strokeWidth={2} aria-hidden />
            </button>

            <div className={styles.sliderMain}>
              <header className={styles.header}>
                <p className={styles.eyebrow}>Nuestros proyectos</p>
                <h2
                  id={headingId}
                  ref={headingRef}
                  className={styles.title}
                  aria-label={PROJECTS_HEADING_FULL}
                >
                  <span
                    className={styles.titleSplit}
                    data-title-split
                    aria-hidden="true"
                  >
                    {headingWords.map((word, wi) => (
                      <Fragment key={word.key}>
                        {wi > 0 ? " " : null}
                        <span className={styles.titleWord}>
                          {word.chars.map((item, ci) => (
                            <span
                              key={ci}
                              data-title-char
                              className={clsx(
                                styles.titleChar,
                                item.gradient && styles.titleGradient,
                              )}
                            >
                              {item.char}
                            </span>
                          ))}
                        </span>
                      </Fragment>
                    ))}
                  </span>
                </h2>
              </header>

              <div className={styles.showcaseWrap}>
                <ShowcaseCard
                  key={active.id}
                  project={active}
                  headingId={baseId}
                />
              </div>

              <footer
                className={styles.pagination}
                aria-live="polite"
                data-progress-step={activeIndex + 1}
              >
                <span className={styles.paginationCurrent}>
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>
                <div className={styles.progressTrack} aria-hidden>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${((activeIndex + 1) / count) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.paginationTotal}>
                  {String(count).padStart(2, "0")}
                </span>
              </footer>
            </div>

            <button
              type="button"
              className={styles.arrow}
              onClick={goNext}
              aria-label="Ver proyecto siguiente"
            >
              <ChevronRight size={26} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
