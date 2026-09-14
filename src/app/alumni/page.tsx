import type { Metadata } from "next";
import dynamic from "next/dynamic";

import IveyFooter from "../../components/IveyFooter";
import SiteHeader from "../../components/SiteHeader";
import AlumniExplorer from "../../features/alumni/AlumniExplorer";
import { loadAlumni } from "../../features/alumni/load-alumni";
import styles from "./AlumniPage.module.css";

const AlumniCohorts = dynamic(() => import("../../features/alumni/AlumniCohorts"), {
  loading: () => (
    <section className={styles.cohortsLoading} aria-hidden="true">
      <span>02 / ALUMNI</span>
      <div />
      <div />
    </section>
  ),
});

// Keep the network explorer code available while the map and directory are being reworked.
const SHOW_ALUMNI_EXPLORER = false;

export const metadata: Metadata = {
  title: "Alumni | Ivey Tech Club",
  description: "Explore the Ivey Tech Club alumni network by company, role, and location.",
};

export default async function AlumniPage() {
  const alumni = await loadAlumni();

  return (
    <div className={`site-shell reference-shell ${styles.page}`}>
      <SiteHeader />

      <main id="top">
        <section className={styles.intro} aria-labelledby="alumni-title">
          <div className={styles.introCopy}>
            <h1 id="alumni-title">The network keeps growing after Ivey.</h1>
            <p>See where former ITC members work, what they build, and how each year of the club connects to a wider technology community.</p>
          </div>
        </section>

        {SHOW_ALUMNI_EXPLORER ? <AlumniExplorer alumni={alumni} /> : null}
        <AlumniCohorts alumni={alumni} />
      </main>

      <IveyFooter linkHomeSections />
    </div>
  );
}
