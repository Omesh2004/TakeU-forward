"use client";

import styles from './Calendar.module.css';
import DayCell from '@/components/Calendar/DayCell';
import { formatDateKey } from '@/utils/dateHelpers';

export default function CalendarGrid({
  weekdayLabels,
  cells,
  activeDate,
  today,
  onSelectDate,
  onHoverDate,
  onKeyDown,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isHoverPreview,
  getHolidayLabel,
  getHolidayEntries,
  selection,
  getTaskCount,
  hasDayMemo
}) {
  return (
    <section className={styles.calendarGrid} aria-label="Calendar grid">
      <div className={styles.weekdayRow} aria-hidden="true">
        {weekdayLabels.map((label) => (
          <div key={label} className={styles.weekdayCell}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.dayGrid} role="grid" aria-readonly="true">
        {cells.map((cell) => {
          const holidayEntries = getHolidayEntries(cell.date);
          const dateKey = formatDateKey(cell.date);
          return (
            <DayCell
              key={cell.key}
              date={cell.date}
              label={cell.date.getDate()}
              inCurrentMonth={cell.inCurrentMonth}
              isToday={cell.key === formatDateKey(today)}
              isSelected={Boolean(
                (selection.start && !selection.end && cell.key === formatDateKey(selection.start)) ||
                (selection.start && selection.end && isInRange(cell.date))
              )}
              isInRange={isInRange(cell.date)}
              isRangeStart={isRangeStart(cell.date)}
              isRangeEnd={isRangeEnd(cell.date)}
              isHoverPreview={isHoverPreview(cell.date)}
              holidayLabel={getHolidayLabel(cell.date)}
              holidayCount={holidayEntries.length}
              taskCount={getTaskCount(dateKey)}
              hasDayMemo={hasDayMemo(dateKey)}
              onSelect={onSelectDate}
              onHover={onHoverDate}
              onKeyDown={onKeyDown}
            />
          );
        })}
      </div>
    </section>
  );
}
