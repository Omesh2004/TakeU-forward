import { useMemo, useState } from 'react';
import { addMonths, formatMonthLabel, getMonthGrid, startOfMonth } from '@/utils/dateHelpers';

export function useCalendar(initialDate = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(initialDate));

  const monthGrid = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const monthLabel = useMemo(() => formatMonthLabel(currentMonth), [currentMonth]);

  function shiftMonth(amount) {
    setCurrentMonth((previousMonth) => addMonths(previousMonth, amount));
  }

  return {
    currentMonth,
    setCurrentMonth,
    monthGrid,
    monthLabel,
    shiftMonth
  };
}
