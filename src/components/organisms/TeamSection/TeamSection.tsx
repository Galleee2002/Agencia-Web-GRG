"use client";

import { useTeamMembers } from "@/components/providers/I18nProvider";

import { TeamHeading } from "./TeamHeading";
import { TeamOrigin } from "./TeamOrigin";
import { TeamMemberRows } from "./TeamMemberRows";
import styles from "./TeamSection.module.scss";

export function TeamSection() {
  const members = useTeamMembers();

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
        <TeamOrigin />
        <TeamMemberRows members={members} />
      </div>
    </section>
  );
}
