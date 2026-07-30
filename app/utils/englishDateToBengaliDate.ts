import { useSystemStore } from '../store/systemStore';

const bengaliDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const bengaliMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const toBengaliDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => bengaliDigits[digit]);

/**
 * Formats an ISO date (for example, `2026-07-30`) for the active app locale.
 * The date-only parsing avoids timezone shifts on devices outside UTC.
 */
export const englishDateToBengaliDate = (
  value: string | Date | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === '') return '';

  let year: number;
  let month: number;
  let day: number;

  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      year = Number(match[1]);
      month = Number(match[2]);
      day = Number(match[3]);
    } else {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      year = parsed.getFullYear();
      month = parsed.getMonth() + 1;
      day = parsed.getDate();
    }
  } else {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    year = parsed.getFullYear();
    month = parsed.getMonth() + 1;
    day = parsed.getDate();
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return String(value);
  }

  if (useSystemStore.getState().lang === 'en') {
    return `${day} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)} ${year}`;
  }

  return `${toBengaliDigits(day)} ${bengaliMonths[month - 1]} ${toBengaliDigits(year)}`;
};

export default englishDateToBengaliDate;
