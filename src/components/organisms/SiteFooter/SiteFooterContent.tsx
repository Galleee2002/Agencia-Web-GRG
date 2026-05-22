"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { ThemeLogo } from "@/components/atoms/ThemeLogo";
import { useI18n, useSiteNavItems } from "@/components/providers/I18nProvider";

import styles from "./SiteFooter.module.scss";

const QUICK_LINKS_ID = "footer-quick-links-heading";
const CONTACT_ID = "footer-contact-heading";
const HOME_LINK = "/#inicio";

function phoneToTelUri(display: string): string {
  const digits = display.replace(/\D/g, "");
  return digits.length > 0 ? `tel:+${digits}` : "tel:";
}

export function SiteFooterContent() {
  const { t } = useI18n();
  const navItems = useSiteNavItems().filter((item) => item.link !== HOME_LINK);
  const companyName = t("footer.companyName");
  const year = new Date().getFullYear();
  const email = t("footer.email");
  const phone = t("footer.phone");

  return (
    <div className={styles.inner}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Link
            href="/#inicio"
            className={styles.logoLink}
            aria-label={t("footer.logoAria", { company: companyName })}
          >
            <ThemeLogo className={styles.logo} />
          </Link>
          <p className={styles.description}>{t("footer.description")}</p>
        </div>

        <section className={styles.contact} aria-labelledby={CONTACT_ID}>
          <h2 className={styles.columnTitle} id={CONTACT_ID}>
            {t("footer.contact")}
          </h2>
          <ul className={styles.contactList}>
            <li>
              <a href={`mailto:${email}`} className={styles.contactLink}>
                <Mail
                  className={styles.contactIcon}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span>{email}</span>
              </a>
            </li>
            <li>
              <a href={phoneToTelUri(phone)} className={styles.contactLink}>
                <Phone
                  className={styles.contactIcon}
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span>{phone}</span>
              </a>
            </li>
            <li className={styles.contactAddressRow}>
              <MapPin
                className={styles.contactIcon}
                strokeWidth={1.75}
                aria-hidden
              />
              <span className={styles.contactAddress}>
                {t("footer.address")}
              </span>
            </li>
          </ul>
        </section>

        <nav className={styles.links} aria-labelledby={QUICK_LINKS_ID}>
          <h2 className={styles.columnTitle} id={QUICK_LINKS_ID}>
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
          {t("footer.copyrightBefore", { year })}
          <span className={styles.copyrightBrand}>{companyName}</span>
          {t("footer.copyrightAfter")}
        </p>
      </div>
    </div>
  );
}
