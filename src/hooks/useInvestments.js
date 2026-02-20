import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';
import { PIE_COLORS } from '../theme';

export function useInvestments() {
  const { mutualFunds, fixedDeposits } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  // Mutual Funds
  const refreshMF = useCallback(async () => {
    const all = await db.mutualFunds.toArray();
    dispatch({ type: 'SET_MUTUAL_FUNDS', payload: all });
    return all;
  }, [dispatch]);

  const addMF = useCallback(async (mf) => {
    await db.mutualFunds.add({
      ...mf,
      amount: parseFloat(mf.amount),
      color: mf.color || PIE_COLORS[mutualFunds.length % PIE_COLORS.length],
    });
    await refreshMF();
    showSnackbar('Mutual fund added');
  }, [mutualFunds.length, refreshMF, showSnackbar]);

  const updateMF = useCallback(async (id, updates) => {
    await db.mutualFunds.update(id, updates);
    await refreshMF();
    showSnackbar('Mutual fund updated');
  }, [refreshMF, showSnackbar]);

  const deleteMF = useCallback(async (id) => {
    await db.mutualFunds.delete(id);
    await refreshMF();
    showSnackbar('Mutual fund deleted', 'info');
  }, [refreshMF, showSnackbar]);

  // Fixed Deposits
  const refreshFD = useCallback(async () => {
    const all = await db.fixedDeposits.toArray();
    dispatch({ type: 'SET_FIXED_DEPOSITS', payload: all });
    return all;
  }, [dispatch]);

  const addFD = useCallback(async (fd) => {
    await db.fixedDeposits.add({
      ...fd,
      amount: parseFloat(fd.amount),
      status: fd.status || 'active',
    });
    await refreshFD();
    showSnackbar('Fixed deposit added');
  }, [refreshFD, showSnackbar]);

  const updateFD = useCallback(async (id, updates) => {
    await db.fixedDeposits.update(id, updates);
    await refreshFD();
    showSnackbar('Fixed deposit updated');
  }, [refreshFD, showSnackbar]);

  const deleteFD = useCallback(async (id) => {
    await db.fixedDeposits.delete(id);
    await refreshFD();
    showSnackbar('Fixed deposit deleted', 'info');
  }, [refreshFD, showSnackbar]);

  const totalMF = mutualFunds.reduce((s, f) => s + f.amount, 0);
  const totalFD = fixedDeposits.reduce((s, f) => s + f.amount, 0);

  return {
    mutualFunds, fixedDeposits, totalMF, totalFD,
    addMF, updateMF, deleteMF,
    addFD, updateFD, deleteFD,
  };
}
