"use client";

import styles from './Calendar.module.css';
import { formatDateKey, formatShortDate } from '@/utils/dateHelpers';

export default function DayCell({
  date,
  label,
  inCurrentMonth,
  isToday,
  isSelected,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isHoverPreview,
  holidayLabel,
  holidayCount,
  taskCount,
  hasDayMemo,
  onSelect,
  onHover,
  onKeyDown
}) {
  const dataAttributes = {
    'data-in-month': inCurrentMonth,
    'data-today': isToday,
    'data-selected': isSelected,
    'data-in-range': isInRange,
    'data-range-start': isRangeStart,
    'data-range-end': isRangeEnd,
    'data-hover-range': isHoverPreview
  };

  // Build a smart label for the day cell bottom
  let metaLabel = '';
  if (isToday) {
    metaLabel = 'Today';
  } else if (holidayCount > 0) {
    const firstHoliday = holidayLabel.split('·')[0].split(':').pop().trim();
    metaLabel = firstHoliday.length > 12 ? firstHoliday.slice(0, 11) + '…' : firstHoliday;
  }

  // Show indicators for tasks/memos
  const hasContent = taskCount > 0 || hasDayMemo;

  return (
    <button
      type="button"
      className={styles.dayCell}
      {...dataAttributes}
      role="gridcell"
      aria-label={formatShortDate(date)}
      onClick={(event) => onSelect(date, event)}
      onMouseEnter={(event) => onHover(date, event)}
      onMouseLeave={() => onHover(null)}
      onKeyDown={(event) => onKeyDown(event, date)}
      title={holidayLabel || formatDateKey(date)}
    >
      <span className={styles.dayNumberRow}>
        <span className={styles.dayNumberBadge}>{label}</span>
        <span className={styles.dayIndicators}>
          {holidayCount > 0 && <span className={styles.holidayDot} title={holidayLabel} />}
          {hasContent && <span className={styles.taskDot} title={`${taskCount} task${taskCount !== 1 ? 's' : ''}`} />}
        </span>
      </span>
      {metaLabel && (
        <span className={styles.dayMeta}>
          <span className={styles.dayLabel}>{metaLabel}</span>
        </span>
      )}
    </button>
  );
}
