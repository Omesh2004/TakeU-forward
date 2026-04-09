"use client";

import styles from '@/components/Calendar/Calendar.module.css';

export default function FlipTransition({ direction, isActive, children }) {
  return (
    <div
      className={[
        styles.flipStage,
        isActive && direction === 'next' ? styles.flipNext : '',
        isActive && direction === 'prev' ? styles.flipPrev : ''
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
