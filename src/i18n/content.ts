import { LEGAL_PATHS } from "@/config/site";
import type { SiteNavItem, LegalNavLink } from "@/config/siteNavigation";
import type { ContactSelectOption } from "@/components/organisms/ContactSection/contactFormData";
import type { PortfolioProject } from "@/components/organisms/ProjectsSection/projectsData";
import type { TeamMember } from "@/components/organisms/TeamSection/teamData";
import type { WorkWithUsStep } from "@/components/organisms/WorkWithUsSection/workWithUsSteps";
import { portfolioProjectsBase } from "@/components/organisms/ProjectsSection/projectsData";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

import { getMessage } from "./getMessage";
import type { InterpolationParams, Messages, TranslationKey } from "./types";

export type TranslateFn = (
  key: TranslationKey,
  params?: InterpolationParams,
) => string;

export function createTranslate(messages: Messages): TranslateFn {
  return (key, params) => getMessage(messages, key, params);
}

export function getSiteNavItems(t: TranslateFn): SiteNavItem[] {
  return [
    { label: t("nav.home"), link: "/#inicio", ariaLabel: t("nav.homeAria") },
    {
      label: t("nav.process"),
      link: "/#trabajar-con-nosotros",
      ariaLabel: t("nav.processAria"),
    },
    {
      label: t("nav.projects"),
      link: "/#proyectos",
      ariaLabel: t("nav.projectsAria"),
    },
    { label: t("nav.team"), link: "/#equipo", ariaLabel: t("nav.teamAria") },
    {
      label: t("nav.contact"),
      link: "/#contact",
      ariaLabel: t("nav.contactAria"),
    },
  ];
}

export function getSiteLegalLinks(t: TranslateFn): LegalNavLink[] {
  return [
    { label: t("footer.privacy"), href: LEGAL_PATHS.privacy },
    { label: t("footer.terms"), href: LEGAL_PATHS.terms },
    { label: t("footer.cookies"), href: LEGAL_PATHS.cookies },
  ];
}

export function getServiceOptions(t: TranslateFn): ContactSelectOption[] {
  return [
    { value: "corporate", label: t("contact.services.corporate") },
    { value: "ecommerce", label: t("contact.services.ecommerce") },
    { value: "landing", label: t("contact.services.landing") },
    { value: "redesign", label: t("contact.services.redesign") },
    { value: "maintenance", label: t("contact.services.maintenance") },
    { value: "other", label: t("contact.services.other") },
  ];
}

function teamIllustration(file: string): string {
  const webpName = file.endsWith(".webp")
    ? file
    : `${file.replace(/\.(png|jpe?g|svg)$/i, "")}.webp`;
  return publicAssetUrl(`/team/${webpName}`);
}

export function getTeamMembers(t: TranslateFn): readonly TeamMember[] {
  return [
    {
      name: "Gael Garcia",
      nameSegments: [
        { text: "Gael " },
        { text: "G", accent: true },
        { text: "arcia" },
      ],
      role: t("team.role"),
      description: [
        { text: t("team.gael.description.part1") },
        { text: t("team.gael.description.emphasize"), emphasize: true },
        { text: t("team.gael.description.part2") },
      ],
      imageSrc: teamIllustration("gael-ilustracion.webp"),
      imageAlt: t("team.gael.imageAlt"),
      imageWidth: 1086,
      imageHeight: 1448,
    },
    {
      name: "Manuel Rodriguez Garcia",
      nameSegments: [
        { text: "Manuel " },
        { text: "R", accent: true },
        { text: "odriguez " },
        { text: "G", accent: true },
        { text: "arcia" },
      ],
      role: t("team.role"),
      description: [
        { text: t("team.manuel.description.part1") },
        { text: t("team.manuel.description.emphasize"), emphasize: true },
        { text: t("team.manuel.description.part2") },
      ],
      imageSrc: teamIllustration("manuel-ilustracion.webp"),
      imageAlt: t("team.manuel.imageAlt"),
      imageWidth: 1086,
      imageHeight: 1448,
    },
  ] as const;
}

export function getWorkWithUsSteps(t: TranslateFn): WorkWithUsStep[] {
  return [
    {
      id: "paso-1",
      number: "01",
      title: t("workWithUs.steps.step1.title"),
      text: t("workWithUs.steps.step1.text"),
      imageSrc: "/work-with-us/idea.webp",
      imageAlt: t("workWithUs.steps.step1.imageAlt"),
      imageFirst: true,
    },
    {
      id: "paso-2",
      number: "02",
      title: t("workWithUs.steps.step2.title"),
      text: t("workWithUs.steps.step2.text"),
      imageSrc: "/work-with-us/plan.webp",
      imageAlt: t("workWithUs.steps.step2.imageAlt"),
      imageFirst: false,
    },
    {
      id: "paso-3",
      number: "03",
      title: t("workWithUs.steps.step3.title"),
      text: t("workWithUs.steps.step3.text"),
      imageSrc: "/work-with-us/entrega.webp",
      imageAlt: t("workWithUs.steps.step3.imageAlt"),
      imageFirst: true,
    },
  ];
}

export function getPortfolioProjects(t: TranslateFn): PortfolioProject[] {
  return portfolioProjectsBase.map((project) => ({
    ...project,
    description: t(
      `projects.items.${String(project.id)}.description` as TranslationKey,
    ),
  }));
}

export type DisplayLinePart = { text: string; accent?: boolean };
export type DisplayLine = { key: string; parts: DisplayLinePart[] };

export function getProjectsDisplayLinesMobile(t: TranslateFn): DisplayLine[] {
  return [
    {
      key: "m1",
      parts: [
        { text: t("projects.displayMobile.line1a") },
        { text: t("projects.displayMobile.line1b"), accent: true },
      ],
    },
    {
      key: "m2",
      parts: [
        { text: t("projects.displayMobile.line2a") },
        { text: t("projects.displayMobile.line2b"), accent: true },
      ],
    },
  ];
}

export function getProjectsDisplayLinesDesktop(t: TranslateFn): DisplayLine[] {
  return [
    { key: "l1", parts: [{ text: t("projects.displayDesktop.line1") }] },
    {
      key: "l2",
      parts: [
        { text: t("projects.displayDesktop.line2a") },
        { text: t("projects.displayDesktop.line2b"), accent: true },
      ],
    },
    { key: "l3", parts: [{ text: t("projects.displayDesktop.line3") }] },
    {
      key: "l4",
      parts: [{ text: t("projects.displayDesktop.line4"), accent: true }],
    },
  ];
}

export function clientLabel(
  t: TranslateFn,
  type: PortfolioProject["clientType"],
): string {
  return type === "national"
    ? t("projects.clientNational")
    : t("projects.clientInternational");
}
