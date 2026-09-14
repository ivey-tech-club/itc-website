import SiteHeader from "../../components/SiteHeader";
import styles from "./AlumniPage.module.css";

export default function AlumniLoading() {
  return (
    <div className={`site-shell reference-shell ${styles.page}`} aria-busy="true">
      <SiteHeader />
      <main id="top">
        <section className={styles.intro} aria-labelledby="alumni-loading-title">
          <div className={styles.introCopy}>
            <h1 id="alumni-loading-title">The network keeps growing after Ivey.</h1>
            <p>Loading the alumni network…</p>
          </div>
        </section>
        <section className={styles.loadingExplorer} aria-hidden="true">
          <div className={styles.loadingExplorerHeader}>
            <span>01 / ALUMNI NETWORK</span>
            <span>Preparing the directory</span>
          </div>
          <div className={styles.loadingGrid}>
            <div className={styles.loadingPanel}>
              <div className={styles.loadingSearch} />
              <div className={styles.loadingRows}>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.loadingPanel}>
              <div className={styles.loadingMap} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
