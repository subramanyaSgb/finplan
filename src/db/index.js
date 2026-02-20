import Dexie from 'dexie';

export const db = new Dexie('FinPlanDB');

db.version(1).stores({
  monthlyData:     '++id, month, year, &monthKey',
  expenses:        '++id, date, category, amount, currency, isRecurring',
  goals:           '++id, name, status',
  mutualFunds:     '++id, name, amount',
  fixedDeposits:   '++id, bank, amount, maturity, status',
  reminders:       '++id, name, dueDate, isRecurring, frequency',
  recurringRules:  '++id, type, category, amount, frequency, nextDate, isActive',
  categories:      '++id, name, type, icon, color, visible, sortOrder',
  archivedSavings: '++id, category, amount, archivedDate',
  currencyRates:   '&code, rate, lastUpdated',
  settings:        '&key, value',
});
