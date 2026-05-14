import {
  AgencyStaggeredMenu,
  Hero,
  ProjectsSection,
  SiteFooter,
  TeamSection,
} from "@/components/organisms";
import styles from "./HomeTemplate.module.scss";

export function HomeTemplate() {
  return (
    <div className={styles.container}>
      <div className={styles.pageHeroStack}>
        <AgencyStaggeredMenu />
        <Hero />
      </div>
      <ProjectsSection />
      <TeamSection />
      <SiteFooter />
    </div>
  );
}
