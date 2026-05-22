import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudyPage } from "@/components/pages/ProjectCaseStudyPage/ProjectCaseStudyPage";
import { SITE_NAME } from "@/config/site";
import {
  getAllProjectSlugs,
  getProjectBySlug,
  getProjectDescriptionEs,
} from "@/lib/projects/projectBySlug";
import { buildProjectJsonLd } from "@/lib/seo/projectJsonLd";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const description = getProjectDescriptionEs(project.id);
  const title = `${project.name} — caso de estudio`;

  return {
    title,
    description,
    alternates: { canonical: `/proyectos/${slug}` },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      images: project.images[0] ? [{ url: project.images[0], alt: project.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: project.images[0] ? [project.images[0]] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const description = getProjectDescriptionEs(project.id);
  const jsonLd = buildProjectJsonLd(project, description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectCaseStudyPage slug={slug} />
    </>
  );
}
