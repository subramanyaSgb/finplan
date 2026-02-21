import { db } from '../db';

export async function importFullBackup(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!data.version || !data.monthlyData) {
    throw new Error('Invalid backup file format');
  }

  await db.transaction('rw',
    db.monthlyData, db.expenses, db.goals, db.mutualFunds,
    db.fixedDeposits, db.reminders, db.recurringRules,
    db.categories, db.archivedSavings, db.settings,
    async () => {
      await Promise.all([
        db.monthlyData.clear(), db.expenses.clear(), db.goals.clear(),
        db.mutualFunds.clear(), db.fixedDeposits.clear(), db.reminders.clear(),
        db.recurringRules.clear(), db.categories.clear(), db.archivedSavings.clear(),
        db.settings.clear(),
      ]);
      const strip = (arr) => (arr || []).map(({ id, ...rest }) => rest);
      await db.monthlyData.bulkAdd(strip(data.monthlyData));
      await db.expenses.bulkAdd(strip(data.expenses));
      await db.goals.bulkAdd(strip(data.goals));
      await db.mutualFunds.bulkAdd(strip(data.mutualFunds));
      await db.fixedDeposits.bulkAdd(strip(data.fixedDeposits));
      await db.reminders.bulkAdd(strip(data.reminders));
      await db.recurringRules.bulkAdd(strip(data.recurringRules));
      await db.categories.bulkAdd(strip(data.categories));
      await db.archivedSavings.bulkAdd(strip(data.archivedSavings));
      if (data.settings) await db.settings.bulkPut(data.settings);
    }
  );
}
