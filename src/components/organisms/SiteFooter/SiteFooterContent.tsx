import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";

import {
  SITE_LEGAL_LINKS,
  SITE_NAV_ITEMS,
  SITE_SOCIAL_LINKS,
} from "@/config/siteNavigation";

import styles from "./SiteFooter.module.scss";

const COMPANY_NAME = "Agencia Web GMG";

const DESCRIPTION =
  "Somos tu socio digital de confianza: diseño y desarrollo web con criterio, " +
  "rendimiento y una identidad clara para que tu marca destaque con solvencia.";

const QUICK_LINKS_ID = "footer-quick-links-heading";

function socialIconForLabel(label: string) {
  const key = label.toLowerCase();
  if (key.includes("mail") || key.includes("correo")) return Mail;
  return ExternalLink;
}

export function SiteFooterContent() {
  const year = new Date().getFullYear();
  const showSocials = SITE_SOCIAL_LINKS.length > 0;

  return (
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link
            href="/#inicio"
            className={styles.logoLink}
            aria-label={`${COMPANY_NAME}, ir al inicio`}
          >
            <Image
              className={styles.logo}
              src="/logo-negro.svg"
              alt=""
              width={120}
              height={36}
              decoding="async"
              style={{ width: "auto" }}
            />
          </Link>
          <p className={styles.description}>{DESCRIPTION}</p>
          {showSocials ? (
            <div className={styles.socials}>
              {SITE_SOCIAL_LINKS.map((item) => {
                const Icon = socialIconForLabel(item.label);
                return (
                  <a
                    key={`${item.label}-${item.link}`}
                    href={item.link}
                    className={styles.socialLink}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className={styles.socialIcon} strokeWidth={1.75} />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        <nav className={styles.links} aria-labelledby={QUICK_LINKS_ID}>
          <h2 className={styles.linksTitle} id={QUICK_LINKS_ID}>
            Enlaces rápidos
          </h2>
          <ul className={styles.linksList}>
            {SITE_NAV_ITEMS.map((item) => (
              <li key={item.link}>
                <Link
                  href={item.link}
                  className={styles.navLink}
                  aria-label={item.ariaLabel}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <hr className={styles.divider} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {year} {COMPANY_NAME}. Todos los derechos reservados.
        </p>
        <ul className={styles.legal}>
          {SITE_LEGAL_LINKS.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={styles.legalLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
