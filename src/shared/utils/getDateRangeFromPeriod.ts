import { isValid, parseISO, startOfMonth, startOfWeek, subDays } from 'date-fns';

export function getDateRangeFromPeriod(
  period: 'day' | 'week' | 'month' | 'custom',
  fromParam?: string,
  toParam?: string,
) {
  const today = new Date();

  switch (period) {
    case 'day':
      return { from: subDays(today, 1), to: today };

    case 'week':
      return { from: startOfWeek(today, { weekStartsOn: 1 }), to: today };

    case 'month':
      return { from: startOfMonth(today), to: today };

    case 'custom': {
      if (!fromParam || !toParam) {
        throw new Error('Custom period requires from and to query parameters');
      }

      const from = parseISO(fromParam);
      const to = parseISO(toParam);

      if (!isValid(from) || !isValid(to)) {
        throw new Error('Invalid date format for custom period');
      }

      return { from, to };
    }

    default:
      throw new Error('Invalid period');
  }
}
