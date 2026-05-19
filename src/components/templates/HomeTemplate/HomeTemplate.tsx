import {
  AgencyStaggeredMenu,
  Hero,
  ContactSection,
  ProjectsSection,
  SiteFooterReveal,
  TeamSection,
} from "@/components/organisms";
import { HomeHeroStack } from "./HomeHeroStack";
import styles from "./HomeTemplate.module.scss";

export function HomeTemplate() {
  return (
    <div className={styles.container}>
      <HomeHeroStack>
        <div className={styles.pageHeroStack}>
          <AgencyStaggeredMenu />
          <Hero />
        </div>
      </HomeHeroStack>
      <ProjectsSection />
      <TeamSection />
      <ContactSection />
      <SiteFooterReveal />
    </div>
  );
}
