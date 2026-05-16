import { TeamHeading } from "./TeamHeading";
import { teamMembers } from "./teamData";
import { TeamMemberRows } from "./TeamMemberRows";
import { TeamReadingPath } from "./TeamReadingPath";
import styles from "./TeamSection.module.scss";

export function TeamSection() {
  return (
    <section
      id="equipo"
      className={styles.section}
      aria-labelledby="team-heading"
    >
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "#equipo article{opacity:1!important;transform:none!important;transition:none!important}",
          }}
        />
      </noscript>
      <TeamReadingPath />
      <div className={styles.inner}>
        <TeamHeading />

        <TeamMemberRows members={teamMembers} />
      </div>
    </section>
  );
}
