import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';

export function useGoals() {
  const { goals } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  const refreshGoals = useCallback(async () => {
    const all = await db.goals.toArray();
    dispatch({ type: 'SET_GOALS', payload: all });
    return all;
  }, [dispatch]);

  const addGoal = useCallback(async (goal) => {
    await db.goals.add({
      ...goal,
      target: parseFloat(goal.target),
      saved: parseFloat(goal.saved || 0),
      status: 'active',
      sources: goal.sources || [],
    });
    await refreshGoals();
    showSnackbar('Goal added');
  }, [refreshGoals, showSnackbar]);

  const updateGoal = useCallback(async (id, updates) => {
    await db.goals.update(id, updates);
    await refreshGoals();
    showSnackbar('Goal updated');
  }, [refreshGoals, showSnackbar]);

  const updateSaved = useCallback(async (id, delta) => {
    const goal = await db.goals.get(id);
    if (goal) {
      await db.goals.update(id, { saved: Math.max(0, goal.saved + delta) });
      await refreshGoals();
    }
  }, [refreshGoals]);

  const deleteGoal = useCallback(async (id) => {
    await db.goals.delete(id);
    await refreshGoals();
    showSnackbar('Goal deleted', 'info');
  }, [refreshGoals, showSnackbar]);

  return { goals, addGoal, updateGoal, updateSaved, deleteGoal };
}
