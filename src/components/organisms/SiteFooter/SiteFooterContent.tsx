"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";

import {
  useI18n,
  useSiteLegalLinks,
  useSiteNavItems,
} from "@/components/providers/I18nProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { siteLogoForTheme } from "@/config/siteAssets";
import { SITE_SOCIAL_LINKS } from "@/config/siteNavigation";

import styles from "./SiteFooter.module.scss";

const QUICK_LINKS_ID = "footer-quick-links-heading";

function socialIconForLabel(label: string) {
  const key = label.toLowerCase();
  if (key.includes("mail") || key.includes("correo")) return Mail;
  return ExternalLink;
}

export function SiteFooterContent() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const navItems = useSiteNavItems();
  const legalLinks = useSiteLegalLinks();
  const companyName = t("footer.companyName");
  const year = new Date().getFullYear();
  const showSocials = SITE_SOCIAL_LINKS.length > 0;

  return (
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link
            href="/#inicio"
            className={styles.logoLink}
            aria-label={t("footer.logoAria", { company: companyName })}
          >
            <Image
              className={styles.logo}
              src={siteLogoForTheme(theme)}
              alt=""
              width={120}
              height={36}
              decoding="async"
              style={{ width: "auto" }}
            />
          </Link>
          <p className={styles.description}>{t("footer.description")}</p>
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
            {t("footer.quickLinks")}
          </h2>
          <ul className={styles.linksList}>
            {navItems.map((item) => (
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
          {t("footer.copyright", { year, company: companyName })}
        </p>
        <ul className={styles.legal}>
          {legalLinks.map((item) => (
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
