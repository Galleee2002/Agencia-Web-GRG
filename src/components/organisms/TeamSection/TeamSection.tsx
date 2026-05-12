import { TeamHeading } from "./TeamHeading";
import { teamMembers } from "./teamData";
import { TeamMemberRows } from "./TeamMemberRows";
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
      <div className={styles.inner}>
        <TeamHeading />

        <TeamMemberRows members={teamMembers} />
      </div>
    </section>
  );
}
