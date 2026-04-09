"use client";

import styles from './Calendar.module.css';

const OPTIONS = [
  { key: 'light', label: '☀', title: 'Light mode' },
  { key: 'dark', label: '☾', title: 'Dark mode' }
];

export default function ThemeSwitcher({ value, onCycle, onChange }) {
  return (
    <div className={styles.themeGroup} role="group" aria-label="Theme mode">
      {OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`${styles.segmentButton} ${value === option.key ? styles.segmentButtonActive : ''}`}
          onClick={() => onChange(option.key)}
          title={option.title}
          aria-pressed={value === option.key}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
