const HOLIDAY_MAP = {
  '01-01': [
    { region: 'US', label: "New Year's Day" },
    { region: 'IN', label: "New Year's Day" }
  ],
  '01-26': [{ region: 'IN', label: 'Republic Day' }],
  '02-14': [{ region: 'US', label: 'Valentine-inspired observance' }],
  '03-08': [{ region: 'IN', label: 'Holi' }],
  '04-09': [{ region: 'IN', label: 'Gudi Padwa' }],
  '05-01': [{ region: 'IN', label: 'Labour Day' }],
  '07-04': [{ region: 'US', label: 'Independence Day' }],
  '08-15': [
    { region: 'IN', label: 'Independence Day' },
    { region: 'US', label: 'Peak summer observance' }
  ],
  '10-02': [{ region: 'IN', label: 'Gandhi Jayanti' }],
  '10-31': [{ region: 'US', label: 'Halloween' }],
  '11-11': [{ region: 'US', label: 'Veterans Day' }],
  '11-26': [{ region: 'US', label: 'Thanksgiving' }],
  '12-25': [
    { region: 'US', label: 'Christmas Day' },
    { region: 'IN', label: 'Christmas Day' }
  ]
};

export function getHolidayEntries(date) {
  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return HOLIDAY_MAP[key] ?? [];
}

export function getHolidayLabel(date) {
  const entries = getHolidayEntries(date);
  if (!entries.length) {
    return '';
  }

  return entries.map((entry) => `${entry.region}: ${entry.label}`).join(' · ');
}
