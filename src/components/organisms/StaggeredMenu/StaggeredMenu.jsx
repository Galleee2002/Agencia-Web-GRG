import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

const TOGGLE_LABEL_MENU = 'Menú';
const TOGGLE_LABEL_CLOSE = 'Cerrar';

const StaggeredMenu = ({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/logo.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  ctaHref = '/#contact',
  ctaLabel = 'Contáctanos',
  showHeaderCta = true,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);
  const iconRef = useRef(null);
  const textInnerRef = useRef(null);
  const textWrapRef = useRef(null);
  const [textLines, setTextLines] = useState([
    TOGGLE_LABEL_MENU,
    TOGGLE_LABEL_CLOSE,
  ]);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const stickyBrandHostRef = useRef(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !icon) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set(panel, { xPercent: offscreen });
      panel.classList.add('sm-gsap-ready');
      if (preLayers.length) {
        gsap.set(preLayers, { xPercent: offscreen, opacity: 1 });
      }
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
        preContainer.classList.add('sm-gsap-ready');
      }
      gsap.set(icon, { scale: 1, transformOrigin: '50% 50%' });
      if (textInner) {
        gsap.set(textInner, { yPercent: 0 });
      }
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

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
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }
    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }
    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: panelStart, opacity: 1 },
      { xPercent: 0, opacity: 1, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          },
          socialsStart
        );
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        const socialTitle = panel.querySelector('.sm-socials-title');
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busyRef.current = false;
      }
    });
  }, [position]);

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
      if (!btn) return;
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
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(opening => {
    if (isFixed) return;
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? TOGGLE_LABEL_MENU : TOGGLE_LABEL_CLOSE;
    const targetLabel = opening ? TOGGLE_LABEL_CLOSE : TOGGLE_LABEL_MENU;
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === TOGGLE_LABEL_MENU ? TOGGLE_LABEL_CLOSE : TOGGLE_LABEL_MENU;
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
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }
    animateIcon();
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose, isFixed]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon();
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose, isFixed]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = event => {
      const target = event.target;
      const inPanel = panelRef.current?.contains(target);
      const inNavChrome = isFixed
        ? Boolean(stickyBrandHostRef.current?.contains(target))
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
    if (!open) return;

    const scrollY = window.scrollY;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      overscroll: body.style.overscrollBehavior,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    if (scrollbarW > 0) {
      body.style.paddingRight = `${scrollbarW}px`;
    }

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      body.style.overscrollBehavior = prev.overscroll;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!isFixed || typeof window === 'undefined') return;

    const COMPACT_AFTER = 72;

    const readScroll = () => {
      setCompactNav(window.scrollY > COMPACT_AFTER);
    };

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', readScroll);
    };
  }, [isFixed]);

  const logoBlock = (
    <div className="sm-logo" aria-label="Logo">
      <img
        src={logoUrl || '/logo.svg'}
        alt="Logo"
        className="sm-logo-img"
        draggable={false}
        width={110}
        height={24}
      />
    </div>
  );

  const rightColumn = (
    <div className="sm-header-right">
      {showHeaderCta && ctaHref ? (
        <a className="sm-header-cta" href={ctaHref} aria-label={`${ctaLabel}, ir a contacto`}>
          <span className="sm-header-cta-label">{ctaLabel}</span>
          <Mail className="sm-header-cta-icon" size={15} strokeWidth={2} aria-hidden />
        </a>
      ) : null}
    </div>
  );

  const menuLeftColumnFloating = (
    <button
      ref={toggleBtnRef}
      type="button"
      className="sm-header-left sm-toggle"
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
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
      ref={toggleBtnRef}
      type="button"
      className="sm-header-left sm-toggle sm-toggle--fixedBar"
      aria-label={open ? 'Menú abierto' : 'Abrir menú'}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      aria-hidden={open}
      tabIndex={open ? -1 : undefined}
      onClick={toggleMenu}
    >
      <span className="sm-toggle-fixed-row" aria-hidden="true">
        <span className="sm-toggle-labelPlain">Menú</span>
        <span ref={iconRef} className="sm-icon">
          <Menu className="sm-icon-svg" size={18} strokeWidth={2} />
        </span>
      </span>
    </button>
  );

  const menuLeftColumn = isFixed ? menuLeftColumnFixed : menuLeftColumnFloating;

  const stickyBrandBar = isFixed ? (
    <header
      ref={stickyBrandHostRef}
      className="sm-sticky-brand-host"
      data-open={open || undefined}
      data-compact={compactNav || undefined}
      aria-label="Marca y contacto"
    >
      <div className="sm-sticky-brand-inner">
        <div className="sm-brand-col sm-brand-col--start">{menuLeftColumn}</div>
        <div className="sm-brand-col sm-brand-col--center">{logoBlock}</div>
        <div className="sm-brand-col sm-brand-col--end">{rightColumn}</div>
      </div>
    </header>
  ) : null;

  const overlayBody = (
    <>
      <div className="staggered-menu-backdrop" aria-hidden="true" />
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
      {!isFixed ? (
        <header className="staggered-menu-header" aria-label="Main navigation header">
          {menuLeftColumn}
          {logoBlock}
          {rightColumn}
        </header>
      ) : null}

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        {isFixed ? (
          <button type="button" className="sm-panel-close" onClick={closeMenu} aria-label="Cerrar menú">
            <X className="sm-panel-close-icon" size={28} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
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
        </div>
      </aside>
    </>
  );

  const wrapperClassName =
    (className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '');

  const wrapperProps = {
    className: wrapperClassName,
    style: accentColor ? { ['--sm-accent']: accentColor } : undefined,
    'data-position': position,
    'data-open': open || undefined
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
