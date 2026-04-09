const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric'
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

export const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, index) =>
  weekdayFormatter.format(new Date(2026, 7, 2 + index))
);

export const MONTH_NAMES = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(2026, index, 1))
);

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function isSameMonth(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function isBeforeDay(left, right) {
  return startOfDay(left).getTime() < startOfDay(right).getTime();
}

export function isAfterDay(left, right) {
  return startOfDay(left).getTime() > startOfDay(right).getTime();
}

export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthLabel(date) {
  return monthFormatter.format(date);
}

export function formatShortDate(date) {
  return shortDateFormatter.format(date);
}

export function describeRange(startDate, endDate) {
  if (!startDate && !endDate) {
    return 'No dates selected';
  }

  if (startDate && !endDate) {
    return `Starts ${formatShortDate(startDate)}`;
  }

  return `${formatShortDate(startDate)} to ${formatShortDate(endDate)}`;
}

export function formatRangeKey(startDate, endDate) {
  return `${formatDateKey(startDate)}__${formatDateKey(endDate)}`;
}

export function getMonthGrid(date) {
  const monthStart = startOfMonth(date);
  const startOffset = monthStart.getDay();
  const gridStart = addDays(monthStart, -startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = addDays(gridStart, index);

    return {
      date: cellDate,
      key: formatDateKey(cellDate),
      inCurrentMonth: isSameMonth(cellDate, monthStart),
      weekdayIndex: cellDate.getDay()
    };
  });
}

export function getWeekdayLabels() {
  return Array.from({ length: 7 }, (_, index) =>
    weekdayFormatter.format(new Date(2026, 7, 2 + index))
  );
}

export function getNextFocusableDate(date, key) {
  const movementMap = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
    PageUp: -30,
    PageDown: 30
  };

  if (key === 'Home') {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  if (key === 'End') {
    return new Date(date.getFullYear(), date.getMonth(), getDaysInMonth(date));
  }

  if (!(key in movementMap)) {
    return null;
  }

  return addDays(date, movementMap[key]);
}
