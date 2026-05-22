import dynamic from "next/dynamic";

import { SectionDivider } from "@/components/atoms/SectionDivider";
import { AgencyStaggeredMenu, Hero } from "@/components/organisms";

import { HomeHeroStack } from "./HomeHeroStack";
import styles from "./HomeTemplate.module.scss";

const WorkWithUsSection = dynamic(
  () =>
    import("@/components/organisms/WorkWithUsSection").then((m) => ({
      default: m.WorkWithUsSection,
    })),
  { ssr: true },
);

const ProjectsSection = dynamic(
  () =>
    import("@/components/organisms/ProjectsSection/ProjectsSection").then(
      (m) => ({
        default: m.ProjectsSection,
      }),
    ),
  { ssr: true },
);

const TeamSection = dynamic(
  () =>
    import("@/components/organisms/TeamSection/TeamSection").then((m) => ({
      default: m.TeamSection,
    })),
  { ssr: true },
);

const ContactSection = dynamic(
  () =>
    import("@/components/organisms/ContactSection/ContactSection").then(
      (m) => ({
        default: m.ContactSection,
      }),
    ),
  { ssr: true },
);

const SiteFooterReveal = dynamic(
  () =>
    import("@/components/organisms/SiteFooter/SiteFooterReveal").then((m) => ({
      default: m.SiteFooterReveal,
    })),
  { ssr: true },
);

export function HomeTemplate() {
  return (
    <div className={styles.container}>
      <HomeHeroStack>
        <div className={styles.pageHeroStack}>
          <AgencyStaggeredMenu />
          <Hero />
        </div>
      </HomeHeroStack>
      <main id="main-content">
        <WorkWithUsSection />
        <ProjectsSection />
        <TeamSection />
        <SectionDivider />
        <ContactSection />
        <SiteFooterReveal />
      </main>
    </div>
  );
}
