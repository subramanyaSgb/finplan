import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';

export function useRecurring() {
  const { recurringRules } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  const refreshRules = useCallback(async () => {
    const all = await db.recurringRules.toArray();
    dispatch({ type: 'SET_RECURRING_RULES', payload: all });
    return all;
  }, [dispatch]);

  const addRule = useCallback(async (rule) => {
    await db.recurringRules.add({
      ...rule,
      amount: parseFloat(rule.amount),
      isActive: true,
    });
    await refreshRules();
    showSnackbar('Recurring rule added');
  }, [refreshRules, showSnackbar]);

  const updateRule = useCallback(async (id, updates) => {
    await db.recurringRules.update(id, updates);
    await refreshRules();
    showSnackbar('Recurring rule updated');
  }, [refreshRules, showSnackbar]);

  const toggleRule = useCallback(async (id) => {
    const rule = await db.recurringRules.get(id);
    if (rule) {
      await db.recurringRules.update(id, { isActive: !rule.isActive });
      await refreshRules();
    }
  }, [refreshRules]);

  const deleteRule = useCallback(async (id) => {
    await db.recurringRules.delete(id);
    await refreshRules();
    showSnackbar('Recurring rule deleted', 'info');
  }, [refreshRules, showSnackbar]);

  return { recurringRules, addRule, updateRule, toggleRule, deleteRule };
}
