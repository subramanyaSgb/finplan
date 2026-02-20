import { useCallback } from 'react';
import { db } from '../db';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { useSnackbar } from '../context/SnackbarContext';
import { MONTHS } from '../utils/format';

export function useMonthlyData() {
  const { monthlyData, currentMonth } = useAppState();
  const dispatch = useAppDispatch();
  const showSnackbar = useSnackbar();

  const currentData = monthlyData[currentMonth] || {
    month: 'No Data', income: {}, totalIncome: 0,
    expenses: {}, totalExpenses: 0, left: 0, savings: {},
  };

  const refreshMonthlyData = useCallback(async () => {
    const all = await db.monthlyData.orderBy('id').toArray();
    dispatch({ type: 'SET_MONTHLY_DATA', payload: all });
    return all;
  }, [dispatch]);

  const setCurrentMonth = useCallback((index) => {
    dispatch({ type: 'SET_CURRENT_MONTH', payload: index });
  }, [dispatch]);

  const nextMonthLabel = useCallback(() => {
    if (monthlyData.length === 0) {
      const now = new Date();
      return `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
    }
    const last = monthlyData[monthlyData.length - 1].month;
    const [mName, yr] = last.split(' ');
    const mIdx = MONTHS.indexOf(mName.slice(0, 3));
    if (mIdx === 11) return `Jan ${parseInt(yr) + 1}`;
    return `${MONTHS[mIdx + 1]} ${yr}`;
  }, [monthlyData]);

  const buildMonthKey = (monthLabel) => {
    const [mName, yr] = monthLabel.split(' ');
    const mIdx = MONTHS.indexOf(mName.slice(0, 3));
    return `${yr}-${String(mIdx + 1).padStart(2, '0')}`;
  };

  const addMonth = useCallback(async (monthData) => {
    const monthKey = buildMonthKey(monthData.month);
    const record = {
      ...monthData,
      monthKey,
      year: parseInt(monthData.month.split(' ')[1]),
    };
    await db.monthlyData.add(record);
    const all = await refreshMonthlyData();
    dispatch({ type: 'SET_CURRENT_MONTH', payload: all.length - 1 });
    showSnackbar('Month added');
  }, [refreshMonthlyData, dispatch, showSnackbar]);

  const updateMonth = useCallback(async (monthData) => {
    const existing = monthlyData[currentMonth];
    if (!existing) return;
    await db.monthlyData.update(existing.id, monthData);
    await refreshMonthlyData();
    showSnackbar('Month updated');
  }, [monthlyData, currentMonth, refreshMonthlyData, showSnackbar]);

  const deleteMonth = useCallback(async () => {
    const existing = monthlyData[currentMonth];
    if (!existing) return;
    await db.monthlyData.delete(existing.id);
    const all = await refreshMonthlyData();
    dispatch({ type: 'SET_CURRENT_MONTH', payload: Math.max(0, currentMonth - 1) });
    showSnackbar('Month deleted', 'info');
  }, [monthlyData, currentMonth, refreshMonthlyData, dispatch, showSnackbar]);

  // Calculation helpers (ported from original finplan.jsx lines 411-419)
  const isNewFormat = (d) => d.income && typeof d.income === 'object' && Object.keys(d.income).length > 0;

  const calcIncome = (d) => {
    if (isNewFormat(d)) return Object.values(d.income).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    return d.totalIncome || ((d.salary || 0) + (d.reimbursement || 0) + (d.fdReturn || 0) + (d.otherIncome || 0));
  };

  const calcSavings = (d) => d.savings ? Object.values(d.savings).reduce((s, v) => s + (parseFloat(v) || 0), 0) : 0;

  const calcExpenses = (d) => {
    if (isNewFormat(d)) return d.expenses ? Object.values(d.expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0) : 0;
    const inc = calcIncome(d);
    const sav = calcSavings(d);
    return d.totalExpenses ? d.totalExpenses - sav : inc - (d.left || 0) - sav;
  };

  return {
    monthlyData, currentMonth, currentData,
    setCurrentMonth, nextMonthLabel,
    addMonth, updateMonth, deleteMonth,
    calcIncome, calcSavings, calcExpenses,
  };
}
