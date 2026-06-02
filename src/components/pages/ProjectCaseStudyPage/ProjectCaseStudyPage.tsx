"use client";

import Image from "next/image";
import Link from "next/link";

import {
  useClientLabel,
  useI18n,
  usePortfolioProjects,
} from "@/components/providers/I18nProvider";

import styles from "./ProjectCaseStudyPage.module.scss";

type ProjectCaseStudyPageProps = {
  slug: string;
};

export function ProjectCaseStudyPage({ slug }: ProjectCaseStudyPageProps) {
  const { t } = useI18n();
  const projects = usePortfolioProjects();
  const getClientLabel = useClientLabel();
  const project = projects.find((item) => item.href === `/proyectos/${slug}`);

  if (!project) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.notFoundTitle}>
            {t("projectPage.notFoundTitle")}
          </h1>
          <p className={styles.notFoundBody}>{t("projectPage.notFoundBody")}</p>
          <Link href="/#proyectos" className={styles.backLink}>
            ← {t("legal.backProjects")}
          </Link>
        </div>
      </div>
    );
  }

  const [mainImage, ...detailImages] = project.images;
  const baseAlt = t("projects.screenshotAlt", { name: project.name });

  return (
    <div className={styles.page}>
      <article className={styles.inner}>
        <nav className={styles.nav} aria-label={t("legal.backProjects")}>
          <Link href="/#proyectos" className={styles.backLink}>
            ← {t("legal.backProjects")}
          </Link>
        </nav>

        <h1 className={styles.title}>{project.name}</h1>

        <section
          className={styles.gallery}
          aria-label={t("projectPage.galleryLabel")}
        >
          {mainImage ? (
            <figure className={`${styles.galleryFigure} ${styles.galleryMain}`}>
              <Image
                src={mainImage}
                alt={`${baseAlt} — ${t("projects.viewMain")}`}
                fill
                priority
                sizes="(max-width: 719px) 100vw, 58vw"
                className={styles.image}
              />
            </figure>
          ) : null}
          {detailImages.map((src, index) =>
            src ? (
              <figure key={src} className={styles.galleryFigure}>
                <Image
                  src={src}
                  alt={`${baseAlt} — ${t(index === 0 ? "projects.detail1" : "projects.detail2")}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 719px) 92vw, 28vw"
                  className={styles.image}
                />
              </figure>
            ) : null,
          )}
        </section>

        <p className={styles.description}>{project.caseStudyDescription}</p>

        <dl className={styles.meta}>
          <div>
            <dt className={styles.metaLabel}>{t("projectPage.clientLabel")}</dt>
            <dd>{getClientLabel(project.clientType)}</dd>
          </div>
        </dl>

        <div className={styles.technologies}>
          <p className={styles.metaLabel}>{t("projectPage.technologiesLabel")}</p>
          <ul className={styles.techList}>
            {project.technologies.map((tech) => (
              <li key={tech} className={styles.techItem}>
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
