import Image from "next/image";

import { GlobeIcon, LinkedinIcon } from "./AlumniIcons";
import type { AlumniProfile } from "./alumni-data";
import {
  formatLocation,
  getAlumniName,
  safeLinkedInUrl,
} from "./alumni-data";
import { getAlumniHeadshot } from "./alumni-headshots";
import styles from "./Alumni.module.css";
import { getCompanyInitials, getCompanyLogo } from "./company-logos";

export default function AlumniProfileCard({ alumni }: { alumni: AlumniProfile }) {
  const name = getAlumniName(alumni);
  const linkedin = safeLinkedInUrl(alumni.linkedin);
  const companyLogo = getCompanyLogo(alumni.company);
  const headshot = getAlumniHeadshot(alumni);

  return (
    <article className={styles.profileCard}>
      <div className={styles.profileCardTop}>
        <span className={styles.profileLocation}>
          <GlobeIcon aria-hidden="true" />
          <span>{formatLocation(alumni)}</span>
        </span>
        {linkedin ? (
          <a
            className={styles.linkedinLink}
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} on LinkedIn (opens in a new tab)`}
          >
            <LinkedinIcon aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <div className={styles.profileCardBody}>
        <div className={styles.avatarComposition} aria-hidden="true">
          <span className={styles.personInitials}>
            {headshot ? (
              <Image
                className={styles.profileHeadshot}
                src={headshot}
                alt=""
                fill
                sizes="62px"
              />
            ) : (
              getCompanyInitials(name)
            )}
          </span>
          <span className={styles.companyInitials}>
            {companyLogo ? (
              <Image src={companyLogo} alt="" width={22} height={22} />
            ) : (
              getCompanyInitials(alumni.company)
            )}
          </span>
        </div>
        <div className={styles.profileCopy}>
          <h3>{name || "ITC alum"}</h3>
          <p>{alumni.company || "Company not listed"}</p>
          <p>{alumni.jobPosition || alumni.role || "Role not listed"}</p>
        </div>
      </div>
    </article>
  );
}
