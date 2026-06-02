import {
  portfolioProjectsBase,
  type PortfolioProjectBase,
} from "@/components/organisms/ProjectsSection/projectsData";
import { es } from "@/i18n/translations/es";

export function projectSlugFromHref(href: string): string {
  return href.replace(/^\/proyectos\//, "");
}

export function getAllProjectSlugs(): string[] {
  return portfolioProjectsBase.map((project) =>
    projectSlugFromHref(project.href),
  );
}

export function getProjectBySlug(
  slug: string,
): PortfolioProjectBase | undefined {
  return portfolioProjectsBase.find(
    (project) => projectSlugFromHref(project.href) === slug,
  );
}

/** Descripción en español para metadata y SSR (locale por defecto). */
export function getProjectDescriptionEs(projectId: number): string {
  const key = String(projectId) as keyof typeof es.projects.items;
  return es.projects.items[key]?.description ?? "";
}

/** Problema y solución en español para la página de detalle y metadata. */
export function getProjectCaseStudyDescriptionEs(projectId: number): string {
  const key = String(projectId) as keyof typeof es.projects.items;
  return es.projects.items[key]?.caseStudyDescription ?? "";
}
