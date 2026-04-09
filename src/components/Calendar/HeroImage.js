"use client";

import styles from './Calendar.module.css';

export default function HeroImage({ theme, monthLabel }) {
  const year = new Date().getFullYear();

  return (
    <aside className={styles.heroPanel} aria-label={`${monthLabel} hero artwork`}>
      <div className={styles.heroImage} style={{ '--hero-art': `url(${theme.heroArt})` }} />
      <div className={styles.heroCopy}>
        <div className={styles.heroTitleBlock}>
          <p className={styles.heroEyebrow}>{theme.season}</p>
          <h3 className={styles.heroTitle}>{theme.name}</h3>
          <p className={styles.heroSubtext}>{theme.mood}</p>
        </div>
        <div className={styles.heroBadge}>{year}</div>
      </div>
    </aside>
  );
}
