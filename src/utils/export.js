import { db } from '../db';

export async function exportFullBackup() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    monthlyData: await db.monthlyData.toArray(),
    expenses: await db.expenses.toArray(),
    goals: await db.goals.toArray(),
    mutualFunds: await db.mutualFunds.toArray(),
    fixedDeposits: await db.fixedDeposits.toArray(),
    reminders: await db.reminders.toArray(),
    recurringRules: await db.recurringRules.toArray(),
    categories: await db.categories.toArray(),
    archivedSavings: await db.archivedSavings.toArray(),
    settings: await db.settings.toArray(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportTableAsCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'object' && val !== null) return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) return `"${val.replace(/"/g, '""')}"`;
      return val ?? '';
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finplan-${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
