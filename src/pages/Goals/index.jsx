import { useState, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGoals } from '../../hooks/useGoals';
import { useInvestments } from '../../hooks/useInvestments';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { db } from '../../db';
import { COLORS } from '../../theme';
import WealthSnapshot from './WealthSnapshot';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import RecurringSavings from './RecurringSavings';
import ArchivedSavings from './ArchivedSavings';
import MutualFundSection from './MutualFundSection';
import FixedDepositSection from './FixedDepositSection';

export default function Goals() {
  const { goals, addGoal, updateGoal, updateSaved, deleteGoal } = useGoals();
  const {
    mutualFunds, fixedDeposits, totalMF, totalFD,
    addMF, updateMF, deleteMF,
    addFD, updateFD, deleteFD,
  } = useInvestments();
  const { monthlyData } = useMonthlyData();
  const { archivedSavings } = useAppState();
  const dispatch = useAppDispatch();

  // Dialog state
  const [goalFormOpen, setGoalFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showMF, setShowMF] = useState(false);
  const [showFD, setShowFD] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Aggregate savings from monthly data (ported from original lines 1062-1076)
  const { savingsAgg, activeSavings, archivedSavingsList, totalRecurringSavings } = useMemo(() => {
    const agg = {};
    (monthlyData || []).forEach((m) => {
      if (m.savings) {
        Object.entries(m.savings).forEach(([name, amount]) => {
          if (!agg[name]) agg[name] = { total: 0, months: [] };
          agg[name].total += amount;
          agg[name].months.push({ month: m.month, amount });
        });
      }
    });

    // archivedSavings may be array of strings or array of objects with .category
    const archivedNames = (archivedSavings || []).map((a) =>
      typeof a === 'string' ? a : a.category
    );

    const active = Object.entries(agg).filter(([name]) => !archivedNames.includes(name));
    const archived = Object.entries(agg).filter(([name]) => archivedNames.includes(name));
    const totalRecurring = active.reduce((s, [, v]) => s + v.total, 0);

    return {
      savingsAgg: agg,
      activeSavings: active,
      archivedSavingsList: archived,
      totalRecurringSavings: totalRecurring,
    };
  }, [monthlyData, archivedSavings]);

  const totalGoalsSaved = goals.reduce((s, g) => s + (g.saved || 0), 0);

  // Goal form handlers
  const openAddGoal = () => {
    setEditingGoal(null);
    setGoalFormOpen(true);
  };

  const openEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalFormOpen(true);
  };

  // Archive / restore savings
  const handleArchive = async (categoryName, total) => {
    const archivedNames = (archivedSavings || []).map((a) =>
      typeof a === 'string' ? a : a.category
    );
    dispatch({
      type: 'SET_ARCHIVED_SAVINGS',
      payload: [...(archivedSavings || []), { category: categoryName, amount: total, archivedDate: new Date().toISOString() }],
    });
    await db.archivedSavings.add({
      category: categoryName,
      amount: total,
      archivedDate: new Date().toISOString(),
    });
  };

  const handleRestore = async (categoryName) => {
    const updated = (archivedSavings || []).filter((a) => {
      const name = typeof a === 'string' ? a : a.category;
      return name !== categoryName;
    });
    dispatch({ type: 'SET_ARCHIVED_SAVINGS', payload: updated });
    await db.archivedSavings.where('category').equals(categoryName).delete();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          Goals & Savings
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={openAddGoal}
        >
          Goal
        </Button>
      </Box>

      {/* Wealth Snapshot */}
      <WealthSnapshot
        totalFD={totalFD}
        fdCount={fixedDeposits.length}
        totalGoalsSaved={totalGoalsSaved}
        totalMF={totalMF}
        mfCount={mutualFunds.length}
        totalRecurringSavings={totalRecurringSavings}
        onOpenFD={() => setShowFD(true)}
        onOpenMF={() => setShowMF(true)}
      />

      {/* Recurring Savings */}
      <RecurringSavings
        activeSavings={activeSavings}
        archivedCount={archivedSavingsList.length}
        savingsAgg={savingsAgg}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onOpenArchived={() => setShowArchived(true)}
      />

      {/* Goals List */}
      {goals.length > 0 ? (
        goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={openEditGoal}
            onUpdateSaved={updateSaved}
            onDelete={deleteGoal}
          />
        ))
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 5,
            px: 2,
            bgcolor: COLORS.bgCard,
            borderRadius: 3,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography sx={{ fontSize: 40, mb: 1.5 }}>&#127919;</Typography>
          <Typography fontWeight={600} sx={{ mb: 0.5 }}>
            No goals yet
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 2 }}>
            Set financial goals and track your progress toward them.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddGoal}>
            Create Your First Goal
          </Button>
        </Box>
      )}

      {/* Goal Form Dialog */}
      <GoalForm
        open={goalFormOpen}
        onClose={() => { setGoalFormOpen(false); setEditingGoal(null); }}
        goal={editingGoal}
        onAdd={addGoal}
        onUpdate={updateGoal}
        onDelete={deleteGoal}
      />

      {/* Mutual Fund Section Dialog */}
      <MutualFundSection
        open={showMF}
        onClose={() => setShowMF(false)}
        mutualFunds={mutualFunds}
        totalMF={totalMF}
        onAdd={addMF}
        onUpdate={updateMF}
        onDelete={deleteMF}
      />

      {/* Fixed Deposit Section Dialog */}
      <FixedDepositSection
        open={showFD}
        onClose={() => setShowFD(false)}
        fixedDeposits={fixedDeposits}
        totalFD={totalFD}
        onAdd={addFD}
        onUpdate={updateFD}
        onDelete={deleteFD}
      />

      {/* Archived Savings Dialog */}
      <ArchivedSavings
        open={showArchived}
        onClose={() => setShowArchived(false)}
        archivedSavingsList={archivedSavingsList}
        onRestore={handleRestore}
      />
    </Box>
  );
}
