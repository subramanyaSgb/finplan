import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../index';

describe('FinPlan Database', () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it('should have all required tables', () => {
    const tableNames = db.tables.map(t => t.name).sort();
    expect(tableNames).toEqual([
      'archivedSavings', 'categories', 'currencyRates', 'expenses',
      'fixedDeposits', 'goals', 'monthlyData', 'mutualFunds',
      'recurringRules', 'reminders', 'settings',
    ]);
  });

  it('should add and retrieve an expense', async () => {
    const id = await db.expenses.add({
      description: 'Lunch', amount: 250, category: 'Food',
      date: '2026-02-21', currency: 'INR', isRecurring: false,
    });
    const expense = await db.expenses.get(id);
    expect(expense.description).toBe('Lunch');
    expect(expense.amount).toBe(250);
  });

  it('should add and retrieve monthly data by monthKey', async () => {
    await db.monthlyData.add({
      month: 'Feb', year: 2026, monthKey: '2026-02',
      income: {}, totalIncome: 80000, expenses: {}, totalExpenses: 50000,
      left: 30000, savings: {},
    });
    const data = await db.monthlyData.where('monthKey').equals('2026-02').first();
    expect(data.totalIncome).toBe(80000);
  });

  it('should enforce unique monthKey', async () => {
    await db.monthlyData.add({ month: 'Feb', year: 2026, monthKey: '2026-02' });
    await expect(
      db.monthlyData.add({ month: 'Feb', year: 2026, monthKey: '2026-02' })
    ).rejects.toThrow();
  });

  it('should store and retrieve settings by key', async () => {
    await db.settings.put({ key: 'defaultCurrency', value: 'INR' });
    const setting = await db.settings.get('defaultCurrency');
    expect(setting.value).toBe('INR');
  });
});
