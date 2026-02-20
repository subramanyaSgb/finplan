import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';

export function useExpenses() {
  const { expenses } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  const refreshExpenses = useCallback(async () => {
    const all = await db.expenses.orderBy('id').toArray();
    dispatch({ type: 'SET_EXPENSES', payload: all });
    return all;
  }, [dispatch]);

  const addExpense = useCallback(async (expense) => {
    const newExpense = {
      ...expense,
      amount: parseFloat(expense.amount),
      currency: expense.currency || 'INR',
      isRecurring: expense.isRecurring || false,
      createdAt: Date.now(),
    };
    const id = await db.expenses.add(newExpense);
    await refreshExpenses();
    showSnackbar('Expense added');
    return id;
  }, [refreshExpenses, showSnackbar]);

  const updateExpense = useCallback(async (id, updates) => {
    await db.expenses.update(id, updates);
    await refreshExpenses();
    showSnackbar('Expense updated');
  }, [refreshExpenses, showSnackbar]);

  const deleteExpense = useCallback(async (id) => {
    await db.expenses.delete(id);
    await refreshExpenses();
    showSnackbar('Expense deleted', 'info');
  }, [refreshExpenses, showSnackbar]);

  const bulkDelete = useCallback(async (ids) => {
    await db.expenses.bulkDelete(ids);
    await refreshExpenses();
    showSnackbar(`${ids.length} expenses deleted`, 'info');
  }, [refreshExpenses, showSnackbar]);

  return { expenses, addExpense, updateExpense, deleteExpense, bulkDelete };
}
