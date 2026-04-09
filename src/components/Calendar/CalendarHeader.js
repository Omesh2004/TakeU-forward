"use client";

import styles from './Calendar.module.css';
import ThemeSwitcher from '@/components/Calendar/ThemeSwitcher';

export default function CalendarHeader({
  monthLabel,
  monthSubtitle,
  themeMode,
  onPrev,
  onNext,
  onToday,
  onClear,
  onCycleTheme,
  onThemeChange
}) {
  return (
    <header className={styles.header}>
      <div className={styles.headerCopy}>
        <p className={styles.headerEyebrow}>Calendar view</p>
        <h2 className={styles.monthTitle}>{monthLabel}</h2>
        <p className={styles.headerSubtext}>{monthSubtitle}</p>
      </div>

      <div className={styles.controls}>
        <ThemeSwitcher
          value={themeMode}
          onCycle={onCycleTheme}
          onChange={onThemeChange}
        />

        <button className={styles.navButton} type="button" onClick={onToday} title="Jump to today">
          ◉ Today
        </button>
        <button className={styles.navButton} type="button" onClick={onClear} title="Clear selection">
          ✕ Clear
        </button>
        <button className={styles.navButton} type="button" onClick={onPrev} aria-label="Previous month" title="Previous month">
          <span className={styles.buttonIcon}>‹</span>
        </button>
        <button className={styles.navButton} type="button" onClick={onNext} aria-label="Next month" title="Next month">
          <span className={styles.buttonIcon}>›</span>
        </button>
      </div>
    </header>
  );
}
