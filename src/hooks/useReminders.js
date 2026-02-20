import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';

export function useReminders() {
  const { reminders } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  const refreshReminders = useCallback(async () => {
    const all = await db.reminders.toArray();
    dispatch({ type: 'SET_REMINDERS', payload: all });
    return all;
  }, [dispatch]);

  const addReminder = useCallback(async (reminder) => {
    await db.reminders.add({
      ...reminder,
      amount: parseFloat(reminder.amount),
      active: true,
    });
    await refreshReminders();
    showSnackbar('Reminder added');
  }, [refreshReminders, showSnackbar]);

  const updateReminder = useCallback(async (id, updates) => {
    await db.reminders.update(id, updates);
    await refreshReminders();
    showSnackbar('Reminder updated');
  }, [refreshReminders, showSnackbar]);

  const toggleReminder = useCallback(async (id) => {
    const r = await db.reminders.get(id);
    if (r) {
      await db.reminders.update(id, { active: !r.active });
      await refreshReminders();
    }
  }, [refreshReminders]);

  const deleteReminder = useCallback(async (id) => {
    await db.reminders.delete(id);
    await refreshReminders();
    showSnackbar('Reminder deleted', 'info');
  }, [refreshReminders, showSnackbar]);

  return { reminders, addReminder, updateReminder, toggleReminder, deleteReminder };
}
