"use client";

/* eslint-disable @next/next/no-img-element */

import { getCompanyInitials } from "../features/alumni/company-logos";
import type { AlumniWorkplace } from "./company-showcase-data";
import styles from "./CompanyShowcase.module.css";

function AlumniLogo({
  company,
}: {
  company: AlumniWorkplace;
}) {
  const markClassName = [
    styles.alumniMark,
    company.logoVariant === "wordmark" ? styles.alumniMarkWordmark : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.marqueeLogo}>
      <span className={markClassName} aria-hidden="true">
        {company.logoPath ? (
          <img
            src={company.logoPath}
            alt=""
            width={56}
            height={32}
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={styles.alumniMarkFallback}>
            {getCompanyInitials(company.name)}
          </span>
        )}
      </span>
      <span className={styles.marqueeLogoName}>{company.name}</span>
    </div>
  );
}

export default function AlumniMarquee({
  companies,
}: {
  companies: readonly AlumniWorkplace[];
}) {
  const splitAt = Math.ceil(companies.length / 2);
  const rows = [companies.slice(0, splitAt), companies.slice(splitAt)];

  return (
    <div
      className={styles.marqueeStack}
      role="region"
      aria-label="Companies represented in the alumni network"
    >
      {rows.map((row, rowIndex) => {
        const repeatedCompanies = [...row, ...row];
        const trackClass =
          rowIndex === 1
            ? styles.marqueeTrack + " " + styles.marqueeTrackReverse
            : styles.marqueeTrack;

        return (
          <div className={styles.marqueeViewport} key={rowIndex}>
            <div className={trackClass}>
              {repeatedCompanies.map((company, index) => (
                <div
                  className={index >= row.length ? styles.duplicate : undefined}
                  aria-hidden={index >= row.length}
                  key={company.id + "-" + rowIndex + "-" + index}
                >
                  <AlumniLogo company={company} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
