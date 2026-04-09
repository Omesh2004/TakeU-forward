import { useMemo, useState } from 'react';
import {
  describeRange,
  formatRangeKey,
  formatShortDate,
  isBeforeDay,
  isSameDay,
  startOfDay
} from '@/utils/dateHelpers';

export function useRangeSelection() {
  const [selection, setSelection] = useState({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState(null);

  /**
   * Select a date.
   * - Normal click (extendRange=false): selects just that single day (clears any range)
   * - Shift+click (extendRange=true): if a start exists, creates a range to this date
   */
  function selectDate(date, { extendRange = false } = {}) {
    const normalizedDate = startOfDay(date);

    setSelection((currentSelection) => {
      const { start, end } = currentSelection;

      // Shift+click: extend to a range
      if (extendRange && start) {
        // Clicking the same day as start — stay as single day
        if (isSameDay(normalizedDate, start)) {
          return { start: normalizedDate, end: null };
        }

        // Create range, ensuring start < end
        if (isBeforeDay(normalizedDate, start)) {
          return { start: normalizedDate, end: start };
        }

        return { start, end: normalizedDate };
      }

      // Normal click: select single day
      return { start: normalizedDate, end: null };
    });

    setHoverDate(null);
  }

  function clearSelection() {
    setSelection({ start: null, end: null });
    setHoverDate(null);
  }

  const isSingleDay = Boolean(selection.start && !selection.end);
  const isRange = Boolean(selection.start && selection.end);

  const rangeKey = useMemo(() => {
    if (!selection.start || !selection.end) {
      return null;
    }

    return formatRangeKey(selection.start, selection.end);
  }, [selection.end, selection.start]);

  const rangeLabel = useMemo(
    () => describeRange(selection.start, selection.end),
    [selection.start, selection.end]
  );

  const dayLabel = useMemo(() => {
    if (!selection.start) return '';
    return formatShortDate(selection.start);
  }, [selection.start]);

  function isInRange(date) {
    if (!selection.start) {
      return false;
    }

    const normalizedDate = startOfDay(date).getTime();
    const startTime = selection.start.getTime();
    const selectionEnd = selection.end ? selection.end.getTime() : null;

    if (selectionEnd) {
      return normalizedDate >= startTime && normalizedDate <= selectionEnd;
    }

    // Single day selection — only exact match
    return isSameDay(date, selection.start);
  }

  function isRangeStart(date) {
    return Boolean(selection.start && selection.end) && isSameDay(selection.start, date);
  }

  function isRangeEnd(date) {
    return Boolean(selection.end) && isSameDay(selection.end, date);
  }

  function isHoverPreview(date) {
    // Only show hover preview when shift is held (managed by component)
    // We still support it for shift-hover range building
    if (!selection.start || selection.end || !hoverDate) {
      return false;
    }

    const normalizedDate = startOfDay(date).getTime();
    const startTime = selection.start.getTime();
    const hoverTime = startOfDay(hoverDate).getTime();
    const lowerBound = Math.min(startTime, hoverTime);
    const upperBound = Math.max(startTime, hoverTime);

    return normalizedDate >= lowerBound && normalizedDate <= upperBound;
  }

  return {
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
  };
}
