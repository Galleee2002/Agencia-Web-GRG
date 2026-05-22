import { SITE_NAME, SITE_URL } from "@/config/site";
import type { PortfolioProjectBase } from "@/components/organisms/ProjectsSection/projectsData";
import { projectSlugFromHref } from "@/lib/projects/projectBySlug";

export function buildProjectJsonLd(
  project: PortfolioProjectBase,
  description: string,
) {
  const slug = projectSlugFromHref(project.href);
  const pageUrl = `${SITE_URL}/proyectos/${slug}`;
  const image = project.images[0]
    ? new URL(project.images[0], SITE_URL).toString()
    : undefined;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: SITE_NAME,
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Proyectos",
          item: `${SITE_URL}/#proyectos`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: project.name,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.name,
      description,
      url: pageUrl,
      image,
      creator: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      keywords: project.technologies.join(", "),
    },
  ];
}
