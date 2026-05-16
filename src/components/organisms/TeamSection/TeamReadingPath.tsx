"use client";

import { useLayoutEffect, useRef } from "react";

import styles from "./TeamSection.module.scss";

const STROKE = "#f7f9fc";
const LINE_WIDTH = 2.5;

type Point = { x: number; y: number };

function zigzagBetween(
  a: Point,
  b: Point,
  amplitude: number,
  zigCount: number,
): Point[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return [];
  const steps = Math.min(64, Math.max(6, Math.round(len / 20)));
  const px = -dy / len;
  const py = dx / len;
  const out: Point[] = [];
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const wobble = Math.sin(t * Math.PI * zigCount) * amplitude;
    out.push({
      x: a.x + dx * t + px * wobble,
      y: a.y + dy * t + py * wobble,
    });
  }
  return out;
}

function buildPath(
  anchors: Point[],
  amplitude: number,
  zigCount: number,
): Point[] {
  if (anchors.length < 2) return anchors;
  const path: Point[] = [anchors[0]];
  for (let i = 0; i < anchors.length - 1; i += 1) {
    path.push(...zigzagBetween(anchors[i], anchors[i + 1], amplitude, zigCount));
    path.push(anchors[i + 1]);
  }
  return path;
}

export function TeamReadingPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const section = canvas.closest("section#equipo");
    if (!(section instanceof HTMLElement)) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sectionRect = section.getBoundingClientRect();
      const w = sectionRect.width;
      const h = sectionRect.height;
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const heading = section.querySelector("#team-heading");
      const articles = [...section.querySelectorAll("article[data-member-index]")].filter(
        (el): el is HTMLElement => el instanceof HTMLElement,
      );

      if (!heading || articles.length === 0) return;

      const hRect = heading.getBoundingClientRect();
      const anchors: Point[] = [
        {
          x: hRect.left - sectionRect.left + hRect.width / 2,
          y: hRect.bottom - sectionRect.top,
        },
      ];

      articles.forEach((article, i) => {
        const r = article.getBoundingClientRect();
        const biasX = i % 2 === 0 ? 0.22 : 0.78;
        anchors.push({
          x: r.left - sectionRect.left + r.width * biasX,
          y: r.top - sectionRect.top + r.height / 2,
        });
      });

      const lastRect = articles[articles.length - 1].getBoundingClientRect();
      anchors.push({
        x: lastRect.left - sectionRect.left + lastRect.width / 2,
        y: lastRect.bottom - sectionRect.top,
      });

      const amplitude = Math.min(28, Math.max(10, w * 0.04));
      const path = buildPath(anchors, amplitude, 5);

      ctx.strokeStyle = STROKE;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i += 1) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    };

    draw();

    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(section);

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={styles.readingPath} aria-hidden>
      <canvas ref={canvasRef} className={styles.readingPathCanvas} aria-hidden />
    </div>
  );
}
