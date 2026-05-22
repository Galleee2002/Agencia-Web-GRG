"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

import "./Plasma.css";

export interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  /** Pausa el loop WebGL (p. ej. menú overlay abierto). */
  paused?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

type PlasmaVisualProps = {
  color?: string;
  speed: number;
  direction: PlasmaProps["direction"];
  scale: number;
  opacity: number;
  mouseInteractive: boolean;
};

function applyPlasmaUniforms(program: Program, props: PlasmaVisualProps) {
  const customColorRgb = props.color ? hexToRgb(props.color) : [1, 1, 1];
  const colorUniform = program.uniforms.uCustomColor.value as Float32Array;
  colorUniform[0] = customColorRgb[0];
  colorUniform[1] = customColorRgb[1];
  colorUniform[2] = customColorRgb[2];
  (program.uniforms.uUseCustomColor as { value: number }).value = props.color ? 1.0 : 0.0;
  (program.uniforms.uSpeed as { value: number }).value = props.speed * 0.4;
  (program.uniforms.uDirection as { value: number }).value =
    props.direction === "reverse" ? -1.0 : 1.0;
  (program.uniforms.uScale as { value: number }).value = props.scale;
  (program.uniforms.uOpacity as { value: number }).value = props.opacity;
  (program.uniforms.uMouseInteractive as { value: number }).value =
    props.mouseInteractive ? 1.0 : 0.0;
}

function isDesktopHeavyFootprint(cssWidth: number, cssHeight: number): boolean {
  const w = Math.max(1, cssWidth);
  const h = Math.max(1, cssHeight);
  const area = w * h;
  const shortSide = Math.min(w, h);
  return shortSide >= 600 && area >= 450_000;
}

function getInternalCssSize(cssWidth: number, cssHeight: number): { iw: number; ih: number } {
  const cssW = Math.max(1, cssWidth);
  const cssH = Math.max(1, cssHeight);
  const area = cssW * cssH;
  if (!isDesktopHeavyFootprint(cssW, cssH) || area <= 520_000) {
    return { iw: cssW, ih: cssH };
  }

  const ratio = Math.sqrt(520_000 / area);
  return {
    iw: Math.max(1, Math.floor(cssW * ratio)),
    ih: Math.max(1, Math.floor(cssH * ratio)),
  };
}

function getPlasmaDpr(cssWidth: number, cssHeight: number): number {
  const device = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const w = Math.max(1, cssWidth);
  const h = Math.max(1, cssHeight);
  const area = w * h;
  const longSide = Math.max(w, h);

  if (area >= 560_000 || longSide >= 1000) {
    return Math.min(device, 1);
  }
  if (area >= 320_000 || longSide >= 720) {
    return Math.min(device, 1.25);
  }
  return Math.min(device, 1.5);
}

function getIterationCount(cssWidth: number, cssHeight: number): number {
  const area = Math.max(1, cssWidth) * Math.max(1, cssHeight);
  if (area >= 560_000) return 36;
  if (area >= 320_000) return 44;
  return 60;
}

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
uniform float uSteps;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;

  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);

  float d = 0.0;
  float z = 0.0;
  float T = iTime * uSpeed * uDirection;
  vec3 O = vec3(0.0);
  vec3 p = vec3(0.0);
  vec3 S = vec3(0.0);

  for (int stepIndex = 0; stepIndex < 60; stepIndex++) {
    if (float(stepIndex) >= uSteps) break;
    vec2 r = iResolution.xy;
    vec2 Q;

    p = z * normalize(vec3(C - 0.5 * r, r.y));
    p.z -= 4.0;
    S = p;
    d = p.y - T;

    p.x += 0.4 * (1.0 + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
    Q = p.xz *= mat2(cos(p.y + vec4(0.0, 11.0, 33.0, 0.0) - T));
    z += d = abs(sqrt(length(Q * Q)) - 0.25 * (5.0 + S.y)) / 3.0 + 8e-4;
    o = 1.0 + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2.0, 1.0, 0.0, 8.0));
    O += o.w / d * o.xyz;
  }

  o.xyz = tanh(O / 1e4);
}

bool finite1(float x) { return !(isnan(x) || isinf(x)); }

vec3 sanitize(vec3 c) {
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);

  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  rgb *= 1.18;
  rgb = min(rgb, vec3(1.0));

  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));

  float alphaSignal = clamp(length(rgb) * 0.75, 0.0, 1.0);
  float alpha = clamp((0.22 + alphaSignal * 0.9) * uOpacity, 0.0, 1.0);
  fragColor = vec4(finalColor, alpha);
}`;

function Plasma({
  color,
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = false,
  paused = false,
}: PlasmaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const pausedRef = useRef(paused);
  const isVisibleRef = useRef(true);
  const contextLostRef = useRef(false);
  const rafRef = useRef(0);
  const scheduleLoopRef = useRef<(() => void) | null>(null);
  const propsRef = useRef<PlasmaVisualProps>({
    color,
    speed,
    direction,
    scale,
    opacity,
    mouseInteractive,
  });
  const programRef = useRef<Program | null>(null);

  useEffect(() => {
    propsRef.current = { color, speed, direction, scale, opacity, mouseInteractive };
    if (programRef.current) {
      applyPlasmaUniforms(programRef.current, propsRef.current);
    }
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    const boot = () => {
      if (disposed || !containerRef.current) return;
      const el = containerRef.current;

    el.querySelectorAll("canvas").forEach((node) => {
      node.remove();
    });

    const startW =
      typeof window !== "undefined" ? Math.max(1, Math.floor(window.innerWidth)) : 1;
    const startH =
      typeof window !== "undefined" ? Math.max(1, Math.floor(window.innerHeight)) : 1;
    const startInternal = getInternalCssSize(startW, startH);
    let startDpr = getPlasmaDpr(startInternal.iw, startInternal.ih);
    if (startInternal.iw < startW || startInternal.ih < startH) {
      startDpr = Math.min(startDpr, 1);
    }

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        antialias: false,
        dpr: startDpr,
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array([1, 1, 1]) },
        uUseCustomColor: { value: 0 },
        uSpeed: { value: 0.4 },
        uDirection: { value: 1 },
        uScale: { value: 1 },
        uOpacity: { value: 1 },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: 0 },
        uSteps: { value: 60 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program, frustumCulled: false });
    programRef.current = program;
    applyPlasmaUniforms(program, propsRef.current);
    const reducedMotion = typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const cssSize = { w: 1, h: 1 };

    const syncMouseUniformToBuffer = () => {
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      const cw = cssSize.w;
      const ch = cssSize.h;
      const bufW = gl.drawingBufferWidth;
      const bufH = gl.drawingBufferHeight;
      if (cw <= 0 || ch <= 0) return;

      mouseUniform[0] = (mouseCurrent.current.x / cw) * bufW;
      mouseUniform[1] = (mouseCurrent.current.y / ch) * bufH;
    };

    let minFrameMs = 1000 / 60;

    const setSize = () => {
      const rect = el.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));
      cssSize.w = cssW;
      cssSize.h = cssH;
      boundsRef.current = { left: rect.left, top: rect.top, width: cssW, height: cssH };

      const { iw, ih } = getInternalCssSize(cssW, cssH);
      let nextDpr = getPlasmaDpr(iw, ih);
      if (iw < cssW || ih < cssH) {
        nextDpr = Math.min(nextDpr, 1);
      }

      if (renderer.dpr !== nextDpr) {
        renderer.dpr = nextDpr;
      }

      renderer.setSize(iw, ih);
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      (program.uniforms.uSteps as { value: number }).value = getIterationCount(iw, ih);

      const prefersReducedMotion = reducedMotion?.matches ?? false;
      minFrameMs = prefersReducedMotion
        ? 1000 / 20
        : isDesktopHeavyFootprint(cssW, cssH)
          ? 1000 / 30
          : 1000 / 60;

      if (!propsRef.current.mouseInteractive) return;
      mouseTarget.current.x = cssW * 0.5;
      mouseTarget.current.y = cssH * 0.5;
      mouseCurrent.current.x = cssW * 0.5;
      mouseCurrent.current.y = cssH * 0.5;
      syncMouseUniformToBuffer();
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(el);
    setSize();

    let isVisible = document.visibilityState === "visible";
    isVisibleRef.current = isVisible;
    contextLostRef.current = false;
    const t0 = performance.now();
    let lastDrawMs = 0;

    const scheduleLoop = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };

    const loop = (t: number) => {
      rafRef.current = 0;
      if (contextLostRef.current || !isVisibleRef.current || pausedRef.current) return;

      if (propsRef.current.mouseInteractive) {
        const current = mouseCurrent.current;
        const target = mouseTarget.current;
        current.x += (target.x - current.x) * 0.14;
        current.y += (target.y - current.y) * 0.14;
        syncMouseUniformToBuffer();
      }

      const timeValue = (t - t0) * 0.001;
      if (propsRef.current.direction === "pingpong") {
        const pingpongDuration = 10;
        const segmentTime = timeValue % pingpongDuration;
        const isForward = Math.floor(timeValue / pingpongDuration) % 2 === 0;
        const u = segmentTime / pingpongDuration;
        const smooth = u * u * (3 - 2 * u);
        const pingpongTime = isForward
          ? smooth * pingpongDuration
          : (1 - smooth) * pingpongDuration;
        (program.uniforms.uDirection as { value: number }).value = 1.0;
        (program.uniforms.iTime as { value: number }).value = pingpongTime;
      } else {
        (program.uniforms.iTime as { value: number }).value = timeValue;
      }

      if (t - lastDrawMs >= minFrameMs) {
        lastDrawMs = t;
        renderer.render({ scene: mesh });
      }

      scheduleLoop();
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLostRef.current = true;
      stopLoop();
    };

    const handleContextRestored = () => {
      contextLostRef.current = false;
      if (isVisibleRef.current && !pausedRef.current) {
        stopLoop();
        scheduleLoop();
      }
    };

    const handleVisibilityChange = () => {
      const nextVisible = document.visibilityState === "visible";
      if (nextVisible === isVisible) return;

      isVisible = nextVisible;
      isVisibleRef.current = nextVisible;
      if (isVisibleRef.current && !contextLostRef.current && !pausedRef.current) {
        stopLoop();
        scheduleLoop();
      } else {
        stopLoop();
      }
    };

    const handleMotionPreferenceChange = () => {
      setSize();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion?.addEventListener("change", handleMotionPreferenceChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = entry.isIntersecting && document.visibilityState === "visible";
        const wasVisible = isVisible;
        isVisible = nextVisible;
        isVisibleRef.current = nextVisible;

        if (isVisibleRef.current && !wasVisible && !contextLostRef.current && !pausedRef.current) {
          stopLoop();
          scheduleLoop();
        } else if (!isVisibleRef.current && wasVisible) {
          stopLoop();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);

    scheduleLoopRef.current = scheduleLoop;

    if (!pausedRef.current) {
      scheduleLoop();
    }

    teardown = () => {
      scheduleLoopRef.current = null;
      stopLoop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion?.removeEventListener("change", handleMotionPreferenceChange);

      programRef.current = null;
      if (canvas.isConnected) {
        canvas.remove();
      }
    };
    };

    const useIdle =
      typeof window !== "undefined" &&
      typeof window.requestIdleCallback === "function";
    const idleId = useIdle
      ? window.requestIdleCallback(boot, { timeout: 400 })
      : window.setTimeout(boot, 200);

    return () => {
      disposed = true;
      if (useIdle) {
        window.cancelIdleCallback(idleId as number);
      } else {
        window.clearTimeout(idleId as number);
      }
      teardown?.();
    };
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!propsRef.current.mouseInteractive) return;
      const bounds = boundsRef.current;
      mouseTarget.current.x = event.clientX - bounds.left;
      mouseTarget.current.y = event.clientY - bounds.top;
    };

    if (!mouseInteractive) return;

    containerEl.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      containerEl.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseInteractive]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      return;
    }
    if (isVisibleRef.current && !contextLostRef.current) {
      scheduleLoopRef.current?.();
    }
  }, [paused]);

  return (
    <div
      ref={containerRef}
      className={`plasma-container${mouseInteractive ? "" : " plasma-container--passThrough"}`}
    />
  );
}

export default Plasma;
