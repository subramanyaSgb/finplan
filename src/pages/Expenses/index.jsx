import { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, IconButton, Button, Fab,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { useExpenses } from '../../hooks/useExpenses';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { useAppState } from '../../context/AppContext';
import { COLORS } from '../../theme';
import { fmt, fmtFull, MONTHS } from '../../utils/format';
import SearchBar from './SearchBar';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import CategorySummary from './CategorySummary';
import BudgetSection from './BudgetSection';
import CategoryManager from './CategoryManager';

export default function Expenses() {
  const { expenses, deleteExpense } = useExpenses();
  const { monthlyData, currentMonth, currentData, setCurrentMonth } = useMonthlyData();
  const { categories } = useAppState();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [search, setSearch] = useState('');
  const [showCatManager, setShowCatManager] = useState(false);

  // Visible category names for dropdowns
  const visibleCats = useMemo(
    () => categories.filter((c) => c.visible).map((c) => c.name),
    [categories],
  );

  // Current month context
  const data = currentData;
  const [mName, yr] = (data.month || 'Jan 2026').split(' ');
  const mIdx = MONTHS.indexOf(mName?.slice(0, 3));
  const monthYear = parseInt(yr) || 2026;

  // Default date for new expense forms
  const getDefaultDate = () => {
    const now = new Date();
    if (mIdx < 0 || !monthYear) return now.toISOString().slice(0, 10);
    if (now.getMonth() === mIdx && now.getFullYear() === monthYear) {
      return now.toISOString().slice(0, 10);
    }
    const m = String(mIdx + 1).padStart(2, '0');
    return `${monthYear}-${m}-01`;
  };

  // Filter expenses for current month
  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === mIdx && d.getFullYear() === monthYear;
    });
  }, [expenses, mIdx, monthYear]);

  // Search filter
  const filteredExpenses = useMemo(() => {
    if (!search) return monthExpenses;
    const q = search.toLowerCase();
    return monthExpenses.filter(
      (e) =>
        e.description?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q),
    );
  }, [monthExpenses, search]);

  // Group by date
  const { grouped, sortedDates } = useMemo(() => {
    const g = {};
    filteredExpenses.forEach((e) => {
      const key = e.date || 'Unknown';
      if (!g[key]) g[key] = [];
      g[key].push(e);
    });
    const sd = Object.keys(g).sort((a, b) => b.localeCompare(a));
    return { grouped: g, sortedDates: sd };
  }, [filteredExpenses]);

  // Budget data from monthly sheet
  const budgetExpenses = data.expenses ? Object.entries(data.expenses) : [];
  const budgetSavings = data.savings ? Object.entries(data.savings) : [];
  const budgetTotal =
    budgetExpenses.reduce((s, [, v]) => s + (parseFloat(v) || 0), 0) +
    budgetSavings.reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);
  const quickAddTotal = monthExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const grandTotal = budgetTotal + quickAddTotal;

  // Handlers
  const isFirst = currentMonth === 0;
  const isLast = currentMonth >= monthlyData.length - 1;
  const hasData = monthlyData.length > 0;

  const openEdit = (expense) => {
    setEditExpense(expense);
    setShowEdit(true);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Month Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton
          onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
          disabled={isFirst || !hasData}
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${COLORS.border}`,
            width: 36,
            height: 36,
            '&:hover': { bgcolor: COLORS.bgCardHover },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Box sx={{ textAlign: 'center', flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.3 }}>
            {hasData ? data.month : 'No Data'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Expenses
          </Typography>
        </Box>
        <IconButton
          onClick={() => setCurrentMonth(Math.min(monthlyData.length - 1, currentMonth + 1))}
          disabled={isLast || !hasData}
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${COLORS.border}`,
            width: 36,
            height: 36,
            '&:hover': { bgcolor: COLORS.bgCardHover },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
        <Card>
          <CardContent sx={{ p: '10px 12px !important', textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: COLORS.textMuted, fontWeight: 500, letterSpacing: 0.5, fontSize: 10 }}
            >
              BUDGET
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.red }}>
              {fmt(budgetTotal)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: '10px 12px !important', textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: COLORS.textMuted, fontWeight: 500, letterSpacing: 0.5, fontSize: 10 }}
            >
              QUICK ADD
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.orange }}>
              {fmt(quickAddTotal)}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: '10px 12px !important', textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: COLORS.textMuted, fontWeight: 500, letterSpacing: 0.5, fontSize: 10 }}
            >
              TOTAL
            </Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>
              {fmt(grandTotal)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Budget Section (collapsible) */}
      <BudgetSection currentData={data} />

      {/* Search + Category Manager + Add */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <SearchBar value={search} onChange={setSearch} />
        </Box>
        <IconButton
          onClick={() => setShowCatManager(true)}
          sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 3,
            width: 40,
            height: 40,
            '&:hover': { bgcolor: COLORS.bgCardHover },
          }}
        >
          <SettingsIcon sx={{ fontSize: 18, color: COLORS.textMuted }} />
        </IconButton>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAdd(true)}
          sx={{ flexShrink: 0, px: 2, py: 1 }}
        >
          Add
        </Button>
      </Box>

      {/* Category Summary */}
      <CategorySummary monthExpenses={monthExpenses} />

      {/* Expense List (grouped by date) */}
      <ExpenseList
        grouped={grouped}
        sortedDates={sortedDates}
        search={search}
        total={filteredExpenses.length}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {/* Bottom spacer for FAB */}
      <Box sx={{ height: 60 }} />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={() => setShowAdd(true)}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          zIndex: 50,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Expense Dialog */}
      <ExpenseForm
        open={showAdd}
        onClose={() => setShowAdd(false)}
        expense={null}
        visibleCategories={visibleCats}
        defaultDate={getDefaultDate()}
        onOpenCategoryManager={() => setShowCatManager(true)}
      />

      {/* Edit Expense Dialog */}
      <ExpenseForm
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditExpense(null); }}
        expense={editExpense}
        visibleCategories={visibleCats}
        defaultDate={getDefaultDate()}
        onOpenCategoryManager={() => setShowCatManager(true)}
      />

      {/* Category Manager Dialog */}
      <CategoryManager
        open={showCatManager}
        onClose={() => setShowCatManager(false)}
      />
    </Box>
  );
}
