import Image, { type StaticImageData } from "next/image";

import baincapital from "../assets/sponsors/baincapital.png";
import birchhill from "../assets/sponsors/birchhill.png";
import bondloyalty from "../assets/sponsors/bondloyalty.png";
import cartage from "../assets/sponsors/cartage.png";
import finetune from "../assets/sponsors/finetune.png";
import mckinsey from "../assets/sponsors/mckinsey.png";
import meter from "../assets/sponsors/meter.png";
import microsoft from "../assets/sponsors/microsoft.png";
import notion from "../assets/sponsors/notion.png";
import nvidia from "../assets/sponsors/nvidia.png";
import ramp from "../assets/sponsors/ramp.png";
import rbi from "../assets/sponsors/rbi.png";
import riley from "../assets/sponsors/riley.png";
import salesforce from "../assets/sponsors/salesforce.png";
import scaleai from "../assets/sponsors/scaleai.png";
import upshot from "../assets/sponsors/upshot.png";

import showcase from "../data/json/company-showcase.json";
import { loadAlumni } from "../features/alumni/load-alumni";
import AlumniMarquee from "./AlumniMarquee";
import { getFeaturedAlumniWorkplaces } from "./company-showcase-data";
import styles from "./CompanyShowcase.module.css";

const partnerLogos: Record<string, StaticImageData> = {
  baincapital,
  birchhill,
  bondloyalty,
  cartage,
  finetune,
  mckinsey,
  meter,
  microsoft,
  notion,
  nvidia,
  ramp,
  rbi,
  riley,
  salesforce,
  scaleai,
  upshot,
};

type Partner = (typeof showcase.workedWith)[number];

function PartnerLogo({ company }: { company: Partner }) {
  const logo = partnerLogos[company.logoAsset];

  if (!logo) {
    return <span className={styles.fallbackWordmark}>{company.name}</span>;
  }

  return (
    <Image
      src={logo}
      alt={company.name + " logo"}
      className={styles.partnerImage}
      sizes="(max-width: 760px) 42vw, 135px"
    />
  );
}

export default async function CompanyShowcase() {
  const alumni = await loadAlumni();
  const alumniWorkplaces = getFeaturedAlumniWorkplaces(
    alumni,
    showcase.alumniWorkplaces,
  );

  return (
    <section
      className={styles.showcase}
      id="community"
      aria-labelledby="company-showcase-title"
    >
      <div className={styles.inner}>
        <div className={styles.partnerSection}>
          <div className={styles.blockHeader}>
            <h2 id="company-showcase-title">Organizations we&apos;ve built with</h2>
            <p className={styles.partnerDescription}>
              ITC is made possible by the organizations that show up for our students,
              share their time, and build with us.
            </p>
          </div>

          <div
            className={styles.partnerGrid}
            role="list"
            aria-label="Organizations we have built with"
          >
            {showcase.workedWith.map((company) => (
              <div className={styles.partner} role="listitem" key={company.id}>
                <PartnerLogo company={company} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.alumni}>
          <div className={styles.alumniInner}>
            <div className={styles.alumniIntro}>
              <div className={styles.alumniCopy}>
                <h3>Where the network lands.</h3>
                <p>A glimpse into the teams where our students have learned, built, and helped shape what comes next.</p>
              </div>
            </div>

            <AlumniMarquee companies={alumniWorkplaces} />
          </div>
        </div>
      </div>
    </section>
  );
}
