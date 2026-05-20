"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Globe,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import {
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

const PROJECTS_DISPLAY_FULL = "Convertimos tus ideas en proyectos exitosos";

type DisplayLinePart = { text: string; accent?: boolean };

type DisplayLine = { key: string; parts: DisplayLinePart[] };

const PROJECTS_DISPLAY_LINES_MOBILE: DisplayLine[] = [
  {
    key: "m1",
    parts: [{ text: "Convertimos tus " }, { text: "ideas", accent: true }],
  },
  {
    key: "m2",
    parts: [{ text: "en proyectos " }, { text: "exitosos", accent: true }],
  },
];

const PROJECTS_DISPLAY_LINES_DESKTOP: DisplayLine[] = [
  { key: "l1", parts: [{ text: "Convertimos" }] },
  { key: "l2", parts: [{ text: "tus " }, { text: "ideas", accent: true }] },
  { key: "l3", parts: [{ text: "en proyectos" }] },
  { key: "l4", parts: [{ text: "exitosos", accent: true }] },
];

function renderDisplayLines(lines: DisplayLine[]) {
  return lines.map((line) => (
    <span key={line.key} className={styles.displayLine}>
      {line.parts.map((part, i) => (
        <span
          key={`${line.key}-${i}`}
          className={clsx(part.accent && styles.displayAccent)}
        >
          {part.text}
        </span>
      ))}
    </span>
  ));
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

const SLIDE_OUT_DURATION = 0.34;
const SLIDE_IN_DURATION = 0.5;
const LIGHTBOX_FADE_OUT = 0.14;
const LIGHTBOX_FADE_IN = 0.2;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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
  const [renderedLightboxIndex, setRenderedLightboxIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxMediaRef = useRef<HTMLDivElement>(null);
  const showcaseStageRef = useRef<HTMLDivElement>(null);
  const lightboxLabelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDetailsCompact(false);
    setOverlayHidden(false);
    setLightboxOpen(false);
    setLightboxIndex(0);
    setRenderedLightboxIndex(0);
  }, [project.id]);

  useLayoutEffect(() => {
    const stage = showcaseStageRef.current;
    if (!stage || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = stage.querySelectorAll<HTMLElement>("[data-fade-in]");
      if (!targets.length) return;
      gsap.fromTo(
        targets,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: SLIDE_IN_DURATION,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }, stage);

    return () => {
      ctx.revert();
    };
  }, [project.id]);

  const openLightbox = useCallback((index: number) => {
    const next = ((index % GALLERY_SLICES) + GALLERY_SLICES) % GALLERY_SLICES;
    setLightboxIndex(next);
    setRenderedLightboxIndex(next);
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
    const media = lightboxMediaRef.current;
    if (!media) return;

    if (lightboxIndex === renderedLightboxIndex) {
      if (prefersReducedMotion()) {
        gsap.set(media, { opacity: 1 });
      }
      return;
    }

    if (prefersReducedMotion()) {
      setRenderedLightboxIndex(lightboxIndex);
      gsap.set(media, { opacity: 1 });
      return;
    }

    gsap.killTweensOf(media);
    gsap
      .timeline()
      .to(media, { opacity: 0, duration: LIGHTBOX_FADE_OUT, ease: "power2.in" })
      .add(() => {
        setRenderedLightboxIndex(lightboxIndex);
      })
      .to(media, { opacity: 1, duration: LIGHTBOX_FADE_IN, ease: "power2.out" });
  }, [lightboxIndex, lightboxOpen, renderedLightboxIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const media = lightboxMediaRef.current;
    if (!media || prefersReducedMotion()) return;

    gsap.killTweensOf(media);
    gsap.fromTo(
      media,
      { opacity: 0 },
      { opacity: 1, duration: LIGHTBOX_FADE_IN, ease: "power2.out" },
    );
  }, [lightboxOpen]);

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

  const expandDetails = useCallback(() => {
    setDetailsCompact(false);
    setOverlayHidden(false);
  }, []);

  const collapseDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsCompact(true);
  }, []);

  const handleDetailsCardClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (detailsCompact) {
        expandDetails();
      }
    },
    [detailsCompact, expandDetails],
  );

  const handleDetailsCardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!detailsCompact) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        expandDetails();
      }
    },
    [detailsCompact, expandDetails],
  );

  const currentLightboxSrc = imageSlots[renderedLightboxIndex] ?? "";
  const currentLightboxAlt = `${baseAlt} — ${
    ["vista principal", "detalle 1", "detalle 2"][renderedLightboxIndex] ?? "imagen"
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
          <div className={styles.lightboxInner}>
            <button
              ref={lightboxCloseRef}
              type="button"
              className={styles.lightboxClose}
              aria-label="Cerrar"
              onClick={closeLightbox}
            >
              <X size={22} strokeWidth={2} aria-hidden />
            </button>
            <div className={styles.lightboxFrame}>
              <button
                type="button"
                className={clsx(styles.lightboxNav, styles.lightboxNavPrev)}
                aria-label="Imagen anterior"
                onClick={goLightboxPrev}
              >
                <ChevronLeft size={28} strokeWidth={2} aria-hidden />
              </button>
              <div className={styles.lightboxStage}>
                <div ref={lightboxMediaRef} className={styles.lightboxMedia}>
                  {currentLightboxSrc ? (
                    <Image
                      key={currentLightboxSrc}
                      src={currentLightboxSrc}
                      alt={currentLightboxAlt}
                      width={1100}
                      height={825}
                      className={styles.lightboxImg}
                      sizes="(max-width: 1200px) 92vw"
                      priority
                    />
                  ) : (
                    <div
                      className={styles.lightboxEmpty}
                      role="img"
                      aria-label={currentLightboxAlt}
                    />
                  )}
                </div>
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
          </div>
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
      <div
        ref={showcaseStageRef}
        className={styles.showcaseStage}
        onClick={handleStageClick}
      >
        <div className={styles.showcaseMedia} data-fade-in>
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
        </div>
        <div className={styles.overlaySlot}>
          <div
            data-details-card
            data-fade-in
            className={clsx(
              styles.detailsCard,
              detailsCompact && styles.detailsCardCompact,
            )}
            role={detailsCompact ? "button" : undefined}
            tabIndex={detailsCompact ? 0 : undefined}
            aria-expanded={!detailsCompact}
            aria-label={detailsCompact ? "Mostrar detalles del proyecto" : undefined}
            onClick={handleDetailsCardClick}
            onKeyDown={handleDetailsCardKeyDown}
          >
            {detailsCompact ? (
              <div className={styles.detailsCompactBar}>
                <h3 id={titleId} className={styles.projectNameCompact}>
                  {project.name}
                </h3>
                <span className={styles.detailsChevronIcon} aria-hidden>
                  <ChevronUp size={22} strokeWidth={2} />
                </span>
              </div>
            ) : (
              <>
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
                <button
                  type="button"
                  className={styles.collapseDetailsBtn}
                  onClick={collapseDetails}
                  aria-expanded
                  aria-controls={titleId}
                  aria-label="Ocultar detalles del proyecto"
                >
                  <ChevronDown size={22} strokeWidth={2} aria-hidden />
                </button>
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
  const introRef = useRef<HTMLDivElement>(null);
  const sliderMainRef = useRef<HTMLDivElement>(null);

  useProjectsScrollPerf(sectionRef);

  const active = useMemo(
    () => projects[Math.min(activeIndex, count - 1)] ?? projects[0],
    [activeIndex, projects, count],
  );

  useLayoutEffect(() => {
    const root = introRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const ctx = gsap.context(() => {
      gsap.from(root, {
        y: 16,
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

  const changeProject = useCallback(
    (delta: -1 | 1) => {
      const nextIndex = (activeIndex + delta + count) % count;
      if (nextIndex === activeIndex) return;

      const el = sliderMainRef.current;
      if (!el || prefersReducedMotion()) {
        setActiveIndex(nextIndex);
        return;
      }

      gsap.killTweensOf(el);
      gsap.to(el, {
        opacity: 0,
        y: 16,
        duration: SLIDE_OUT_DURATION,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(nextIndex);
          gsap.fromTo(
            el,
            { opacity: 0, y: -12 },
            {
              opacity: 1,
              y: 0,
              duration: SLIDE_IN_DURATION,
              ease: "power3.out",
              clearProps: "transform",
            },
          );
        },
      });
    },
    [activeIndex, count],
  );

  const goPrev = () => {
    changeProject(-1);
  };

  const goNext = () => {
    changeProject(1);
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
        <div className={styles.shellIntro}>
          <header ref={introRef} className={styles.header} data-intro-display>
            <p className={styles.introEyebrow}>Proyectos</p>
            <h2
              id={headingId}
              className={styles.displayHeading}
              aria-label={PROJECTS_DISPLAY_FULL}
            >
              <span className={styles.displayLinesMobile} aria-hidden>
                {renderDisplayLines(PROJECTS_DISPLAY_LINES_MOBILE)}
              </span>
              <span className={styles.displayLinesDesktop} aria-hidden>
                {renderDisplayLines(PROJECTS_DISPLAY_LINES_DESKTOP)}
              </span>
            </h2>
          </header>
        </div>

        <div
          className={styles.shellCarousel}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Proyectos destacados"
        >
          <div className={styles.sliderBleed}>
            <div className={styles.slider}>
              <button
                type="button"
                className={styles.arrow}
                onClick={goPrev}
                aria-label="Ver proyecto anterior"
              >
                <ChevronLeft size={26} strokeWidth={2} aria-hidden />
              </button>

              <div ref={sliderMainRef} className={styles.sliderMain}>
                <ShowcaseCard project={active} headingId={baseId} />
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

      </div>
    </section>
  );
}
