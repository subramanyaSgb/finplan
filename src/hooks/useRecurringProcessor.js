import { useEffect } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';

/**
 * Check if a recurring rule needs to generate transactions.
 * Returns true if nextDate is in the past or today and the rule is active.
 */
export function shouldGenerate(rule, now = new Date()) {
  if (!rule.isActive) return false;
  const next = new Date(rule.nextDate + 'T00:00:00');
  return next <= now;
}

/**
 * Calculate the next occurrence date after generating.
 */
export function getNextDate(currentDate, frequency) {
  const d = new Date(currentDate + 'T00:00:00');
  switch (frequency) {
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'biweekly':
      d.setDate(d.getDate() + 14);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      d.setMonth(d.getMonth() + 1);
  }
  return d.toISOString().slice(0, 10);
}

/**
 * Process all active recurring rules and generate overdue expenses.
 * Called once on app load after data is loaded.
 */
export function useRecurringProcessor() {
  const { loaded, recurringRules } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loaded) return;

    async function processRules() {
      const now = new Date();
      const activeRules = recurringRules.filter(r => r.isActive);
      let generated = 0;

      for (const rule of activeRules) {
        if (!rule.nextDate) continue;

        // Generate all overdue transactions (could be multiple if app wasn't opened for a while)
        let currentDate = rule.nextDate;
        while (shouldGenerate({ ...rule, nextDate: currentDate }, now)) {
          // Create the expense
          await db.expenses.add({
            description: rule.description || rule.category,
            amount: rule.amount,
            category: rule.category,
            currency: rule.currency || 'INR',
            date: currentDate,
            isRecurring: true,
            createdAt: Date.now(),
            recurringRuleId: rule.id,
          });
          generated++;

          // Advance to next date
          currentDate = getNextDate(currentDate, rule.frequency);
        }

        // Update the rule's next date
        if (currentDate !== rule.nextDate) {
          await db.recurringRules.update(rule.id, { nextDate: currentDate });
        }
      }

      if (generated > 0) {
        // Refresh expenses and rules in context
        const [expenses, rules] = await Promise.all([
          db.expenses.orderBy('id').toArray(),
          db.recurringRules.toArray(),
        ]);
        dispatch({ type: 'SET_EXPENSES', payload: expenses });
        dispatch({ type: 'SET_RECURRING_RULES', payload: rules });
        console.log(`[FinPlan] Generated ${generated} recurring transactions`);
      }
    }

    processRules();
  }, [loaded]); // Only run once when data loads
}
