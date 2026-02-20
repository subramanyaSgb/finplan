import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import MonthSelector from './MonthSelector';
import OverviewCards from './OverviewCards';
import IncomeBreakdown from './IncomeBreakdown';
import ExpenseChart from './ExpenseChart';
import SavingsBreakdown from './SavingsBreakdown';
import NetWorthCard from './NetWorthCard';
import MonthFormDialog from './MonthFormDialog';

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { monthlyData } = useMonthlyData();

  const openAdd = () => {
    setEditMode(false);
    setDialogOpen(true);
  };

  const openEdit = () => {
    setEditMode(true);
    setDialogOpen(true);
  };

  // Empty state: no monthly data yet
  if (monthlyData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5, px: 2.5 }}>
        <Typography sx={{ fontSize: 48, mb: 1.5 }}>
          {'\uD83D\uDC4B'}
        </Typography>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Welcome to FinPlan!
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: COLORS.textMuted, mb: 3, lineHeight: 1.5 }}
        >
          Start by adding your first month's budget data. Track income, expenses,
          and savings all in one place.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ py: 1.75 }}
        >
          Add Your First Month
        </Button>
        <MonthFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editMode={false}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MonthSelector onAdd={openAdd} onEdit={openEdit} />
      <NetWorthCard />
      <OverviewCards />
      <IncomeBreakdown />
      <ExpenseChart />
      <SavingsBreakdown />
      <MonthFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editMode={editMode}
      />
    </Box>
  );
}
