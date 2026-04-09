"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Calendar.module.css';
import { useCalendar } from '@/hooks/useCalendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRangeSelection } from '@/hooks/useRangeSelection';
import { getMonthTheme } from '@/data/monthThemes';
import {
  addMonths,
  formatDateKey,
  formatMonthKey,
  formatMonthLabel,
  formatShortDate,
  getNextFocusableDate,
  getMonthGrid,
  getWeekdayLabels,
  isSameDay,
  startOfDay,
  startOfMonth
} from '@/utils/dateHelpers';
import { getHolidayEntries, getHolidayLabel } from '@/data/holidays';
import CalendarHeader from '@/components/Calendar/CalendarHeader';
import CalendarGrid from '@/components/Calendar/CalendarGrid';
import HeroImage from '@/components/Calendar/HeroImage';
import NotesPanel from '@/components/Calendar/NotesPanel';
import FlipTransition from '@/components/shared/FlipTransition';

const NOTE_STORAGE_KEY = 'wall-calendar-notes-v1';
const THEME_STORAGE_KEY = 'wall-calendar-theme-mode-v1';

function buildThemeVariables(theme, resolvedMode) {
  const isDark = resolvedMode === 'dark';

  return {
    '--accent': theme.accent,
    '--accent-soft': theme.accentSoft,
    '--accent-strong': theme.accentStrong,
    '--hero-a': isDark ? '#0b1320' : theme.accentStrong,
    '--hero-b': isDark ? '#16253c' : theme.accent,
    '--hero-ink': '#ffffff',
    '--surface': isDark ? '#0f1726' : theme.surface,
    '--surface-strong': isDark ? '#162132' : theme.paperStrong,
    '--border': isDark ? 'rgba(155, 183, 255, 0.16)' : theme.border,
    '--ink': isDark ? '#eef4ff' : theme.ink,
    '--muted': isDark ? '#9fb0c9' : theme.muted,
    '--focus': isDark ? 'rgba(133, 173, 255, 0.24)' : 'rgba(79, 140, 255, 0.24)',
    '--shadow-lg': isDark ? '0 24px 70px rgba(3, 8, 17, 0.42)' : '0 24px 70px rgba(16, 31, 54, 0.18)',
    '--shadow-md': isDark ? '0 14px 34px rgba(3, 8, 17, 0.3)' : '0 14px 34px rgba(16, 31, 54, 0.12)'
  };
}



/**
 * Find all saved ranges that contain the given date.
 * Returns an array of { label, memo } objects.
 */
function findRangesForDay(notesStore, day) {
  if (!day) return [];

  const dayTime = startOfDay(day).getTime();
  const results = [];

  for (const key of Object.keys(notesStore)) {
    if (!key.startsWith('range:')) continue;

    const rangePart = key.slice(6); // remove 'range:'
    const parts = rangePart.split('__');
    if (parts.length !== 2) continue;

    const startDate = new Date(parts[0] + 'T00:00:00');
    const endDate = new Date(parts[1] + 'T00:00:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) continue;

    if (dayTime >= startDate.getTime() && dayTime <= endDate.getTime()) {
      results.push({
        label: `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`,
        memo: notesStore[key] || '',
        startDate,
        endDate
      });
    }
  }

  return results;
}

export default function Calendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const { currentMonth, setCurrentMonth, shiftMonth } = useCalendar(today);
  const weekdayLabels = useMemo(() => getWeekdayLabels(), []);
  const [themeMode, setThemeMode] = useLocalStorage(THEME_STORAGE_KEY, 'light');
  const [notesStore, setNotesStore] = useLocalStorage(NOTE_STORAGE_KEY, {});
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [activeDate, setActiveDate] = useState(today);
  const [flipDirection, setFlipDirection] = useState('next');
  const [isFlipping, setIsFlipping] = useState(false);
  const flipTimerRef = useRef(null);

  const resolvedMode = themeMode;
  const theme = getMonthTheme(currentMonth.getMonth());
  const themeVariables = useMemo(() => buildThemeVariables(theme, resolvedMode), [resolvedMode, theme]);

  const {
    selection,
    hoverDate,
    setHoverDate,
    selectDate,
    clearSelection,
    isSingleDay,
    isRange,
    isInRange,
    isRangeStart,
    isRangeEnd,
    isHoverPreview,
    rangeKey,
    rangeLabel,
    dayLabel
  } = useRangeSelection();

  const currentMonthGrid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const currentMonthLabel = useMemo(() => formatMonthLabel(currentMonth), [currentMonth]);

  // ─── Note keys ─────────────────────────────────────

  const monthNoteKey = `month:${formatMonthKey(currentMonth)}`;

  const dayNoteKey = isSingleDay ? `day:${formatDateKey(selection.start)}` : null;
  const dayTasksKey = isSingleDay ? `tasks:${formatDateKey(selection.start)}` : null;

  const rangeNoteKey = rangeKey ? `range:${rangeKey}` : null;

  // ─── Computed values ────────────────────────────────

  const panelMode = isRange ? 'range' : isSingleDay ? 'day' : 'month';

  // Helper: ensure memo data is always an array (handles migration from old string format)
  function ensureMemoArray(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim()) {
      return [{ id: 'migrated-' + Date.now().toString(36), text: raw, createdAt: new Date().toISOString() }];
    }
    return [];
  }

  const monthMemos = ensureMemoArray(notesStore[monthNoteKey]);
  const dayMemos = dayNoteKey ? ensureMemoArray(notesStore[dayNoteKey]) : [];
  const dayTasks = dayTasksKey ? (notesStore[dayTasksKey] ?? []) : [];
  const rangeMemos = rangeNoteKey ? ensureMemoArray(notesStore[rangeNoteKey]) : [];

  const rangeContext = useMemo(
    () => (isSingleDay ? findRangesForDay(notesStore, selection.start) : []),
    [isSingleDay, notesStore, selection.start]
  );

  const visibleHolidayCount = getHolidayEntries(activeDate).length;

  // Reset saved indicator when the active note changes
  useEffect(() => {
    setLastSavedAt(null);
  }, [panelMode, dayNoteKey, rangeNoteKey, monthNoteKey]);

  // Cleanup flip timer
  useEffect(() => {
    return () => {
      if (flipTimerRef.current) {
        window.clearTimeout(flipTimerRef.current);
      }
    };
  }, []);

  // ─── Helpers ────────────────────────────────────────

  // Get task count for a given date key
  const getTaskCount = useCallback(
    (dateKey) => {
      const tasks = notesStore[`tasks:${dateKey}`];
      return Array.isArray(tasks) ? tasks.length : 0;
    },
    [notesStore]
  );

  // Check if a date key has a day memo
  const hasDayMemoFn = useCallback(
    (dateKey) => {
      const memos = notesStore[`day:${dateKey}`];
      return Array.isArray(memos) ? memos.length > 0 : Boolean(memos);
    },
    [notesStore]
  );

  // ─── Actions ────────────────────────────────────────

  function triggerFlip(direction) {
    setFlipDirection(direction);
    setIsFlipping(true);

    if (flipTimerRef.current) {
      window.clearTimeout(flipTimerRef.current);
    }

    flipTimerRef.current = window.setTimeout(() => {
      setIsFlipping(false);
    }, 480);
  }

  function navigateMonth(amount) {
    triggerFlip(amount > 0 ? 'next' : 'prev');
    setCurrentMonth((previousMonth) => addMonths(previousMonth, amount));

    const nextMonth = addMonths(currentMonth, amount);
    setActiveDate(startOfMonth(nextMonth));
  }

  function goToToday() {
    triggerFlip(today > currentMonth ? 'next' : 'prev');
    setCurrentMonth(startOfMonth(today));
    setActiveDate(today);
  }

  function handleDateSelect(date, event) {
    const normalizedDate = startOfDay(date);
    const extendRange = event?.shiftKey ?? false;

    selectDate(normalizedDate, { extendRange });
    setActiveDate(normalizedDate);
  }

  function handleHoverDate(date, event) {
    // Only show hover preview when shift is held (for range building)
    if (date && event?.shiftKey && isSingleDay) {
      setHoverDate(date);
    } else {
      setHoverDate(null);
    }
  }

  function moveFocus(baseDate, key) {
    const nextDate = getNextFocusableDate(baseDate, key);
    if (!nextDate) {
      return baseDate;
    }

    if (!currentMonthGrid.some((cell) => isSameDay(cell.date, nextDate))) {
      setCurrentMonth(startOfMonth(nextDate));
    }

    return nextDate;
  }

  function handleKeyDown(event, cellDate) {
    const navigationKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];

    if (event.key === 'Escape') {
      clearSelection();
      return;
    }

    if (!navigationKeys.includes(event.key) && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();

    if (event.key === 'Enter' || event.key === ' ') {
      handleDateSelect(cellDate, event);
      return;
    }

    const nextDate = moveFocus(cellDate, event.key);
    setActiveDate(nextDate);
  }

  // ─── Memo handlers ──────────────────────────────────

  function handleAddMonthMemo(memo) {
    setNotesStore((prev) => ({
      ...prev,
      [monthNoteKey]: [...ensureMemoArray(prev[monthNoteKey]), memo]
    }));
    setLastSavedAt(new Date());
  }

  function handleRemoveMonthMemo(memoId) {
    setNotesStore((prev) => ({
      ...prev,
      [monthNoteKey]: ensureMemoArray(prev[monthNoteKey]).filter((m) => m.id !== memoId)
    }));
    setLastSavedAt(new Date());
  }

  function handleAddDayMemo(memo) {
    if (!dayNoteKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [dayNoteKey]: [...ensureMemoArray(prev[dayNoteKey]), memo]
    }));
    setLastSavedAt(new Date());
  }

  function handleRemoveDayMemo(memoId) {
    if (!dayNoteKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [dayNoteKey]: ensureMemoArray(prev[dayNoteKey]).filter((m) => m.id !== memoId)
    }));
    setLastSavedAt(new Date());
  }

  function handleAddRangeMemo(memo) {
    if (!rangeNoteKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [rangeNoteKey]: [...ensureMemoArray(prev[rangeNoteKey]), memo]
    }));
    setLastSavedAt(new Date());
  }

  function handleRemoveRangeMemo(memoId) {
    if (!rangeNoteKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [rangeNoteKey]: ensureMemoArray(prev[rangeNoteKey]).filter((m) => m.id !== memoId)
    }));
    setLastSavedAt(new Date());
  }

  // ─── Task handlers ──────────────────────────────────

  function handleAddTask(task) {
    if (!dayTasksKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [dayTasksKey]: [...(prev[dayTasksKey] ?? []), task]
    }));
    setLastSavedAt(new Date());
  }

  function handleToggleTask(taskId) {
    if (!dayTasksKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [dayTasksKey]: (prev[dayTasksKey] ?? []).map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
    }));
    setLastSavedAt(new Date());
  }

  function handleRemoveTask(taskId) {
    if (!dayTasksKey) return;
    setNotesStore((prev) => ({
      ...prev,
      [dayTasksKey]: (prev[dayTasksKey] ?? []).filter((t) => t.id !== taskId)
    }));
    setLastSavedAt(new Date());
  }

  // ─── Theme ──────────────────────────────────────────

  function cycleThemeMode() {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  }

  function setTheme(nextMode) {
    setThemeMode(nextMode);
  }

  // ─── Render ─────────────────────────────────────────

  return (
    <section className={styles.calendarShell} style={themeVariables} data-mode={resolvedMode}>
      <div className={styles.topRail} aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className={styles.layout}>
        <HeroImage theme={theme} monthLabel={currentMonthLabel} />

        <div className={styles.contentPanel}>
          <CalendarHeader
            monthLabel={currentMonthLabel}
            monthSubtitle={theme.mood}
            themeMode={themeMode}
            onPrev={() => navigateMonth(-1)}
            onNext={() => navigateMonth(1)}
            onToday={goToToday}
            onClear={clearSelection}
            onCycleTheme={cycleThemeMode}
            onThemeChange={setTheme}
          />

          {/* Shift hint */}
          {isSingleDay && (
            <p className={styles.shiftHint}>
              💡 Hold <kbd>Shift</kbd> + click another day to select a range
            </p>
          )}

          <FlipTransition direction={flipDirection} isActive={isFlipping} key={formatMonthKey(currentMonth)}>
            <CalendarGrid
              weekdayLabels={weekdayLabels}
              cells={currentMonthGrid}
              activeDate={activeDate}
              today={today}
              onSelectDate={handleDateSelect}
              onHoverDate={handleHoverDate}
              onKeyDown={handleKeyDown}
              isInRange={isInRange}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              isHoverPreview={isHoverPreview}
              getHolidayLabel={getHolidayLabel}
              getHolidayEntries={getHolidayEntries}
              selection={selection}
              getTaskCount={getTaskCount}
              hasDayMemo={hasDayMemoFn}
            />
          </FlipTransition>

          <NotesPanel
            mode={panelMode}
            // Month
            monthLabel={currentMonthLabel}
            monthMemos={monthMemos}
            onAddMonthMemo={handleAddMonthMemo}
            onRemoveMonthMemo={handleRemoveMonthMemo}
            // Day
            selectedDateLabel={dayLabel}
            dayMemos={dayMemos}
            onAddDayMemo={handleAddDayMemo}
            onRemoveDayMemo={handleRemoveDayMemo}
            dayTasks={dayTasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onRemoveTask={handleRemoveTask}
            rangeContext={rangeContext}
            // Range
            rangeLabel={rangeLabel}
            rangeMemos={rangeMemos}
            onAddRangeMemo={handleAddRangeMemo}
            onRemoveRangeMemo={handleRemoveRangeMemo}
            // Common
            savedAt={lastSavedAt}
            visibleHolidayCount={visibleHolidayCount}
          />
        </div>
      </div>
    </section>
  );
}
