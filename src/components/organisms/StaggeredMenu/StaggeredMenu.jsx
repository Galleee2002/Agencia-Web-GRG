import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ThemeLogo } from '@/components/atoms/ThemeLogo';
import './StaggeredMenu.css';

/** Alineado con el panel a ancho completo (@media max-width: 1024px en StaggeredMenu.css). */
const MOBILE_BOTTOM_NAV_MAX_WIDTH = 1024;

function readMotionProfile() {
  if (typeof window === 'undefined') {
    return { reduced: false, compact: false };
  }
  return {
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    compact: window.matchMedia(`(max-width: ${MOBILE_BOTTOM_NAV_MAX_WIDTH}px)`).matches,
  };
}

function useMaxWidth(maxWidthPx) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [maxWidthPx]);

  return matches;
}

const COMPACT_NAV_AFTER = 72;

function readCompactNavFromScroll() {
  if (typeof window === 'undefined') return false;
  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  return scrollY > COMPACT_NAV_AFTER;
}

const StaggeredMenu = ({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  className,
  logoHref = '/#inicio',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  ctaHref = '/#contact',
  ctaLabel = 'Contáctanos',
  showHeaderCta = true,
  toggleLabelMenu = 'Menú',
  toggleLabelClose = 'Cerrar',
  ariaOpenMenu = 'Abrir menú',
  ariaCloseMenu = 'Cerrar menú',
  ariaMenuOpen = 'Menú abierto',
  onMenuOpen,
  onMenuClose,
  /**
   * Nodo opcional que reemplaza el CTA del header en la columna derecha de la sticky bar.
   * Útil para inyectar, por ejemplo, un botón de ajustes inline en lugar del CTA.
   */
  rightSlot = null,
  panelFooterSlot = null,
  dockSlot = null,
}) => {
  const [open, setOpen] = useState(false);
  /* SSR siempre arranca en false para coincidir con la salida del server.
   * useLayoutEffect sincroniza el scroll real antes del paint; las
   * transiciones CSS solo se habilitan después (`navReady`) para no
   * animar achique/agrande en el reload. */
  const [compactNav, setCompactNav] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const mobileBottomNav = useMaxWidth(MOBILE_BOTTOM_NAV_MAX_WIDTH);
  const mobileBottomNavRef = useRef(false);
  const compactNavRef = useRef(false);
  const openRef = useRef(false);
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState([
    toggleLabelMenu,
    toggleLabelClose,
  ]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const stickyBrandHostRef = useRef(null);
  const mobileDockRef = useRef(null);
  const busyRef = useRef(false);

  const setMotionPhase = useCallback(animating => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (animating) {
      wrapper.setAttribute('data-sm-animating', '');
    } else {
      wrapper.removeAttribute('data-sm-animating');
    }
  }, []);

  const clearPillMorphClose = useCallback(() => {
    wrapperRef.current?.removeAttribute('data-sm-pill-morph');
  }, []);

  /** Al cerrar con nav compacta: pill ancha → compacta (sin pasar por 100%). */
  const beginPillMorphClose = useCallback(() => {
    if (!isFixed || mobileBottomNavRef.current || !compactNavRef.current) return;
    const { reduced } = readMotionProfile();
    if (reduced) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    wrapper.removeAttribute('data-open');
    wrapper.setAttribute('data-sm-pill-morph', '');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapper.removeAttribute('data-sm-pill-morph');
      });
    });
  }, [isFixed]);

  useEffect(() => {
    mobileBottomNavRef.current = mobileBottomNav;
  }, [mobileBottomNav]);

  useEffect(() => {
    compactNavRef.current = compactNav;
  }, [compactNav]);
  const itemEntranceTweenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      const { compact: compactMotion } = readMotionProfile();
      if (compactMotion) {
        gsap.set(panel, { xPercent: 0, autoAlpha: 0, y: 0, force3D: true });
      } else {
        gsap.set(panel, { xPercent: offscreen, autoAlpha: 0, y: 0, force3D: true });
      }
      panel.classList.add('sm-gsap-ready');
      if (preLayers.length) {
        gsap.set(preLayers, { xPercent: offscreen, opacity: 1, force3D: true });
      }
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
        preContainer.classList.add('sm-gsap-ready');
      }
      if (icon) {
        gsap.set(icon, { scale: 1, transformOrigin: '50% 50%' });
      }
      if (textInner) {
        gsap.set(textInner, { yPercent: 0 });
      }
      if (toggleBtnRef.current && !mobileBottomNavRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });
    return () => ctx.revert();
  }, [menuButtonColor, position, mobileBottomNav]);

  useEffect(() => {
    const btn = toggleBtnRef.current;
    if (!btn || !mobileBottomNav) return;
    gsap.set(btn, { clearProps: 'color' });
  }, [mobileBottomNav]);

  const resetPanelMotionState = useCallback(panel => {
    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, force3D: true });
    }
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    numberEls.forEach(el => el.classList.remove('sm-num-ready'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const offscreen = position === 'left' ? -100 : 100;
    const { reduced: reducedMotion, compact: compactMotion } = readMotionProfile();

    resetPanelMotionState(panel);

    const finishInstantOpen = () => {
      if (compactMotion) {
        gsap.set(panel, { xPercent: 0, autoAlpha: 1, y: 0, force3D: true });
      } else {
        gsap.set(panel, { xPercent: 0, autoAlpha: 1, force3D: true });
        if (layers.length) gsap.set(layers, { xPercent: 0, force3D: true });
      }
      if (itemEls.length) gsap.set(itemEls, { yPercent: 0, force3D: true });
      numberEls.forEach(el => el.classList.add('sm-num-ready'));
      if (socialTitle) gsap.set(socialTitle, { opacity: 1 });
      if (socialLinks.length) gsap.set(socialLinks, { y: 0, opacity: 1 });
    };

    if (reducedMotion) {
      finishInstantOpen();
      const tl = gsap.timeline({ paused: true });
      openTlRef.current = tl;
      return tl;
    }

    const panelDuration = compactMotion ? 0.42 : 0.58;
    const layerDuration = compactMotion ? 0.34 : 0.46;
    const layerStagger = compactMotion ? 0.04 : 0.06;
    const itemStagger = compactMotion ? 0.05 : 0.07;
    const itemDuration = compactMotion ? 0.58 : 0.72;

    if (compactMotion) {
      gsap.set(panel, {
        xPercent: 0,
        autoAlpha: 1,
        y: 18,
        visibility: 'visible',
        force3D: true,
      });
    } else {
      gsap.set(panel, {
        xPercent: offscreen,
        autoAlpha: 1,
        visibility: 'visible',
        force3D: true,
      });
      if (layers.length) {
        gsap.set(layers, { xPercent: offscreen, force3D: true });
      }
    }

    const tl = gsap.timeline({ paused: true });

    if (compactMotion) {
      /* Móvil: solo el panel blanco (fade + ligero slide Y), sin prelayers ni slide horizontal. */
      tl.fromTo(
        panel,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: panelDuration, ease: 'power2.out', force3D: true },
        0
      );
    } else {
      /* Panel y prelayers arrancan juntos: el panel (z-index mayor) tapa las capas
       * grises y no se filtra la franja de prelayer antes de que entre el aside. */
      tl.fromTo(
        panel,
        { xPercent: offscreen },
        { xPercent: 0, duration: panelDuration, ease: 'power2.out', force3D: true },
        0
      );
      layers.forEach((layer, i) => {
        tl.fromTo(
          layer,
          { xPercent: offscreen },
          { xPercent: 0, duration: layerDuration, ease: 'power2.out', force3D: true },
          i * layerStagger
        );
      });
    }

    if (itemEls.length) {
      const itemsStart = panelDuration * (compactMotion ? 0.22 : 0.18);
      tl.to(
        itemEls,
        {
          yPercent: 0,
          duration: itemDuration,
          ease: 'power2.out',
          stagger: { each: itemStagger, from: 'start' },
          force3D: true,
        },
        itemsStart
      );
      numberEls.forEach((el, index) => {
        tl.call(() => el.classList.add('sm-num-ready'), null, itemsStart + 0.06 + index * itemStagger);
      });
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelDuration * (compactMotion ? 0.35 : 0.38);
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.4, ease: 'power2.out' }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            stagger: { each: itemStagger, from: 'start' },
            force3D: true,
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            },
          },
          socialsStart + 0.03
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position, resetPanelMotionState]);

  const playOpen = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Evita quedar trabado si una animación previa no completó
    busyRef.current = false;
    openTlRef.current?.kill();
    closeTweenRef.current?.kill();

    busyRef.current = true;
    setMotionPhase(true);
    panel.classList.add('sm-gsap-ready', 'sm-panel-opening');
    // Forzar visible YA: setOpen aún no re-renderizó (aria-hidden sigue true)
    wrapperRef.current?.setAttribute('data-open', '');
    gsap.set(panel, { visibility: 'visible', opacity: 1 });

    const tl = buildOpenTimeline();
    if (tl) {
      const { reduced: reducedMotion } = readMotionProfile();
      tl.eventCallback('onComplete', () => {
        panel.classList.remove('sm-panel-opening');
        setMotionPhase(false);
        busyRef.current = false;
      });
      if (reducedMotion) {
        tl.progress(1);
      } else {
        tl.play(0);
      }
    } else {
      panel.classList.remove('sm-panel-opening');
      setMotionPhase(false);
      busyRef.current = false;
    }
  }, [buildOpenTimeline, setMotionPhase]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const { reduced: reducedMotion, compact: compactMotion } = readMotionProfile();
    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current?.kill();
    setMotionPhase(true);
    busyRef.current = true;

    const onCloseSettled = () => {
      if (compactMotion) {
        gsap.set(panel, { xPercent: 0, autoAlpha: 0, y: 0, force3D: true });
      } else {
        gsap.set(panel, { xPercent: offscreen, force3D: true });
        if (layers.length) {
          gsap.set(layers, { xPercent: offscreen, force3D: true });
        }
      }
      const backdrop = wrapperRef.current?.querySelector('.staggered-menu-backdrop');
      if (backdrop) {
        gsap.set(backdrop, { clearProps: 'opacity' });
      }
      panel.classList.remove('sm-panel-opening');
      resetPanelMotionState(panel);
      clearPillMorphClose();
      setOpen(false);
      setMotionPhase(false);
      busyRef.current = false;
    };

    if (reducedMotion) {
      if (compactMotion) {
        gsap.set(panel, { xPercent: 0, autoAlpha: 0, y: 0, force3D: true });
      } else {
        gsap.set(panel, { xPercent: offscreen, force3D: true });
        if (layers.length) {
          gsap.set(layers, { xPercent: offscreen, force3D: true });
        }
      }
      onCloseSettled();
      return;
    }

    beginPillMorphClose();

    const backdrop = wrapperRef.current?.querySelector('.staggered-menu-backdrop');
    const closeDuration = compactMotion ? 0.28 : 0.3;
    const closeEase = 'power2.in';

    const closeTl = gsap.timeline({
      onComplete: onCloseSettled,
      defaults: { ease: closeEase, overwrite: 'auto', force3D: true },
    });

    if (compactMotion) {
      closeTl.to(
        panel,
        { autoAlpha: 0, y: 12, duration: closeDuration },
        0,
      );
      if (backdrop) {
        closeTl.to(backdrop, { opacity: 0, duration: closeDuration }, 0);
      }
    } else {
      /* Panel y prelayers salen juntos (espejo del open). */
      closeTl.to(panel, { xPercent: offscreen, duration: closeDuration }, 0);
      layers.forEach((layer, i) => {
        closeTl.to(
          layer,
          { xPercent: offscreen, duration: closeDuration },
          i * 0.06,
        );
      });
      if (backdrop) {
        closeTl.to(backdrop, { opacity: 0, duration: closeDuration }, 0);
      }
    }

    closeTweenRef.current = closeTl;
  }, [position, resetPanelMotionState, setMotionPhase, beginPillMorphClose, clearPillMorphClose]);

  const animateIcon = useCallback(() => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.fromTo(
      icon,
      { scale: 0.88 },
      { scale: 1, duration: 0.22, ease: 'power2.out', overwrite: 'auto' }
    );
  }, []);

  const animateColor = useCallback(
    opening => {
      const btn = toggleBtnRef.current;
      if (!btn || mobileBottomNavRef.current) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    const btn = toggleBtnRef.current;
    if (!btn) return;
    if (mobileBottomNav) {
      gsap.set(btn, { clearProps: 'color' });
      return;
    }
    if (changeMenuColorOnOpen) {
      const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
      gsap.set(btn, { color: targetColor });
    } else {
      gsap.set(btn, { color: menuButtonColor });
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor, mobileBottomNav]);

  const animateText = useCallback(opening => {
    if (isFixed) return;
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? toggleLabelMenu : toggleLabelClose;
    const targetLabel = opening ? toggleLabelClose : toggleLabelMenu;
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === toggleLabelMenu ? toggleLabelClose : toggleLabelMenu;
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, [isFixed]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    if (target) {
      setOpen(true);
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    if (!mobileBottomNavRef.current) {
      animateIcon();
      animateColor(target);
      animateText(target);
    }
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      onMenuClose?.();
      playClose();
      if (!mobileBottomNavRef.current) {
        animateIcon();
        animateColor(false);
        animateText(false);
      }
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = event => {
      const target = event.target;
      const inPanel = panelRef.current?.contains(target);
      const inNavChrome = isFixed
        ? Boolean(
            stickyBrandHostRef.current?.contains(target) ||
              mobileDockRef.current?.contains(target)
          )
        : Boolean(toggleBtnRef.current?.contains(target));

      if (panelRef.current && !inPanel && !inNavChrome) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu, isFixed]);

  useEffect(() => {
    const onCloseRequest = () => closeMenu();
    window.addEventListener('staggered-menu:close', onCloseRequest);
    return () => window.removeEventListener('staggered-menu:close', onCloseRequest);
  }, [closeMenu]);

  useEffect(() => {
    if (!open) return;

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    if (scrollbarW > 0) {
      body.style.paddingRight = `${scrollbarW}px`;
    }

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPaddingRight;
      body.style.overscrollBehavior = prev.bodyOverscroll;
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!isFixed || typeof window === 'undefined') return;

    let scrollRaf = 0;

    const syncCompactNav = () => {
      const next = readCompactNavFromScroll();
      setCompactNav(prev => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        syncCompactNav();
      });
    };

    // Estado correcto ya (sin animar): el CSS aún no tiene data-nav-ready.
    syncCompactNav();

    const readyRaf = requestAnimationFrame(() => {
      setNavReady(true);
    });

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(readyRaf);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isFixed]);

  const logoBlock = (
    <a
      className="sm-logo"
      href={logoHref}
      aria-label="Ir al inicio"
    >
      <ThemeLogo className="sm-logo-img" />
    </a>
  );

  const headerContactCta =
    showHeaderCta && ctaHref ? (
      <a
        className={`sm-header-cta${mobileBottomNav ? ' sm-header-cta--iconOnly' : ''}`}
        href={ctaHref}
        aria-label={`${ctaLabel}, ir a contacto`}
      >
        {!mobileBottomNav ? <span className="sm-header-cta-label">{ctaLabel}</span> : null}
        <Mail
          className="sm-header-cta-icon"
          size={mobileBottomNav ? 20 : 15}
          strokeWidth={2}
          aria-hidden
        />
      </a>
    ) : null;

  const rightColumn = (
    <div className="sm-header-right">{rightSlot ?? headerContactCta}</div>
  );

  const menuLeftColumnFloating = (
    <button
      ref={toggleBtnRef}
      type="button"
      className="sm-header-left sm-toggle"
      aria-label={open ? ariaCloseMenu : ariaOpenMenu}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      onClick={toggleMenu}
    >
      <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
        <span ref={textInnerRef} className="sm-toggle-textInner">
          {textLines.map((l, i) => (
            <span className="sm-toggle-line" key={i}>
              {l}
            </span>
          ))}
        </span>
      </span>
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        {open ? (
          <X className="sm-icon-svg" size={18} strokeWidth={2} />
        ) : (
          <Menu className="sm-icon-svg" size={18} strokeWidth={2} />
        )}
      </span>
    </button>
  );

  const menuLeftColumnFixed = (
    <button
      type="button"
      className="sm-header-left sm-toggle sm-toggle--fixedBar"
      aria-label={open ? ariaMenuOpen : ariaOpenMenu}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      aria-hidden="true"
      tabIndex={-1}
      onClick={toggleMenu}
    >
      <span className="sm-icon" aria-hidden="true">
        <Menu className="sm-icon-svg" size={20} strokeWidth={1.75} />
      </span>
    </button>
  );

  const menuMobileDockToggle = (
    <button
      ref={toggleBtnRef}
      type="button"
      className="sm-toggle sm-toggle--dock"
      aria-label={ariaOpenMenu}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      onClick={toggleMenu}
    >
      <span className="sm-dock-label" aria-hidden="true">
        {toggleLabelMenu}
      </span>
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        <Menu className="sm-icon-svg" size={20} strokeWidth={1.75} />
      </span>
    </button>
  );

  const menuLeftColumn = isFixed ? menuLeftColumnFixed : menuLeftColumnFloating;

  const stickyBrandBar = isFixed ? (
    <>
      <header
        ref={stickyBrandHostRef}
        className="sm-sticky-brand-host"
        data-open={open || undefined}
        data-compact={compactNav || undefined}
        data-nav-ready={navReady || undefined}
        aria-label="Marca"
      >
        {logoBlock}
      </header>
      <nav
        ref={mobileDockRef}
        className="sm-mobile-bottom-dock"
        aria-label="Acciones principales"
      >
        {menuMobileDockToggle}
        {mobileBottomNav ? dockSlot : null}
      </nav>
    </>
  ) : null;

  const overlayBody = (
    <>
      <div className="staggered-menu-backdrop" aria-hidden="true" />
      {!mobileBottomNav ? (
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
          })()}
        </div>
      ) : null}
      {!isFixed ? (
        <header className="staggered-menu-header" aria-label="Main navigation header">
          {menuLeftColumn}
          {logoBlock}
          {rightColumn}
        </header>
      ) : null}

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        {isFixed && !mobileBottomNav ? (
          <button type="button" className="sm-panel-close" onClick={closeMenu} aria-label={ariaCloseMenu}>
            <X className="sm-panel-close-icon" size={28} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        <div className="sm-panel-inner">
          <div className={mobileBottomNav ? 'sm-panel-nav-mobile' : undefined}>
            <ul
              className="sm-panel-list"
              role="list"
              data-numbering={
                displayItemNumbering && !mobileBottomNav ? true : undefined
              }
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap" key={it.label + idx}>
                    <a className="sm-panel-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap" aria-hidden="true">
                  <span className="sm-panel-item">
                    <span className="sm-panel-itemLabel">No items</span>
                  </span>
                </li>
              )}
            </ul>
          </div>
          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {panelFooterSlot && open && !mobileBottomNav ? (
            <div className="sm-panel-footer">{panelFooterSlot}</div>
          ) : null}
        </div>
        {mobileBottomNav ? (
          <button
            type="button"
            className="sm-panel-close-mobile"
            onClick={closeMenu}
            aria-label={ariaCloseMenu}
          >
            <X className="sm-panel-close-mobile-icon" size={56} strokeWidth={1.5} aria-hidden />
          </button>
        ) : null}
      </aside>
    </>
  );

  const wrapperClassName =
    (className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '');

  const wrapperProps = {
    ref: wrapperRef,
    className: wrapperClassName,
    style: accentColor ? { ['--sm-accent']: accentColor } : undefined,
    'data-position': position,
    'data-open': open || undefined,
  };

  if (isFixed) {
    return (
      <div {...wrapperProps}>
        {stickyBrandBar}
        {overlayBody}
      </div>
    );
  }

  return <div {...wrapperProps}>{overlayBody}</div>;
};

export default StaggeredMenu;
