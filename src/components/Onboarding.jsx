import { useState } from 'react';
import {
  Dialog, DialogContent, DialogActions, Button, Typography,
  Box, TextField, Select, MenuItem, Stepper, Step, StepLabel,
  InputAdornment, Chip,
} from '@mui/material';
import { CURRENCIES, getCurrencySymbol } from '../utils/currency';
import { MONTHS } from '../utils/format';
import { db } from '../db';
import { useAppDispatch } from '../context/AppContext';
import { COLORS } from '../theme';

const DEFAULT_CATEGORIES = [
  'Home', 'House Rent', 'Food', 'Transport', 'Shopping',
  'Entertainment', 'Health', 'Education', 'Bills', 'EMI',
  'Insurance', 'Subscriptions', 'Other',
];

const steps = ['Welcome', 'Currency', 'Income', 'Categories', 'Done'];

export default function Onboarding({ open, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [income, setIncome] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const dispatch = useAppDispatch();

  const handleComplete = async () => {
    const now = new Date();
    const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Save default currency
    await db.settings.put({ key: 'defaultCurrency', value: currency });

    // Create categories
    const catRecords = categories.map((name, i) => ({
      name,
      type: 'expense',
      icon: '',
      color: '',
      visible: true,
      sortOrder: i,
    }));
    await db.categories.bulkAdd(catRecords);

    // Create first month if income provided
    if (income && parseFloat(income) > 0) {
      await db.monthlyData.add({
        month: monthLabel,
        monthKey,
        year: now.getFullYear(),
        income: { Salary: parseFloat(income) },
        totalIncome: parseFloat(income),
        expenses: {},
        totalExpenses: 0,
        left: parseFloat(income),
        savings: {},
      });
    }

    // Reload all data into context
    const [monthlyData, cats, settingsArr] = await Promise.all([
      db.monthlyData.orderBy('id').toArray(),
      db.categories.orderBy('sortOrder').toArray(),
      db.settings.toArray(),
    ]);
    const settings = {};
    settingsArr.forEach(s => { settings[s.key] = s.value; });

    dispatch({
      type: 'INIT_DATA',
      payload: {
        monthlyData,
        categories: cats,
        settings,
        currentMonth: Math.max(0, monthlyData.length - 1),
        expenses: [],
        goals: [],
        reminders: [],
        mutualFunds: [],
        fixedDeposits: [],
        recurringRules: [],
        archivedSavings: [],
        loaded: true,
      },
    });

    onComplete();
  };

  const next = () => setActiveStep(s => s + 1);
  const back = () => setActiveStep(s => s - 1);

  return (
    <Dialog open={open} fullWidth maxWidth="xs" PaperProps={{
      sx: {
        borderRadius: '16px !important',
        position: 'relative !important',
        bottom: 'auto !important',
        m: 2,
        bgcolor: COLORS.bg,
      }
    }}>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3, mt: 1 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: 10 } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box textAlign="center" py={2}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              Welcome to <Box component="span" color="primary.main">FinPlan</Box>
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              Your personal, offline-first finance manager. Track expenses, set goals, and take control of your money.
            </Typography>
          </Box>
        )}

        {activeStep === 1 && (
          <Box py={1}>
            <Typography fontWeight={600} gutterBottom>Choose your currency</Typography>
            <Select value={currency} onChange={e => setCurrency(e.target.value)} fullWidth size="small">
              {CURRENCIES.map(c => (
                <MenuItem key={c.code} value={c.code}>
                  {c.symbol} — {c.name} ({c.code})
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        {activeStep === 2 && (
          <Box py={1}>
            <Typography fontWeight={600} gutterBottom>What's your monthly income?</Typography>
            <Typography color="text.secondary" fontSize={12} mb={2}>
              This creates your first month. You can always edit later.
            </Typography>
            <TextField
              value={income}
              onChange={e => setIncome(e.target.value)}
              type="number"
              placeholder="e.g. 80000"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">{getCurrencySymbol(currency)}</InputAdornment>,
                },
              }}
            />
          </Box>
        )}

        {activeStep === 3 && (
          <Box py={1}>
            <Typography fontWeight={600} gutterBottom>Default expense categories</Typography>
            <Typography color="text.secondary" fontSize={12} mb={2}>
              You can customize these anytime in Settings.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {categories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  onDelete={() => setCategories(c => c.filter(cc => cc !== cat))}
                />
              ))}
            </Box>
          </Box>
        )}

        {activeStep === 4 && (
          <Box textAlign="center" py={2}>
            <Typography variant="h5" fontWeight={800} gutterBottom color="success.main">
              You're all set!
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              Start tracking your finances. Add expenses, set goals, and watch your wealth grow.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        {activeStep > 0 && activeStep < 4 && (
          <Button onClick={back} color="inherit">Back</Button>
        )}
        <Box flex={1} />
        {activeStep < 4 ? (
          <Button variant="contained" onClick={next}>
            {activeStep === 0 ? "Get Started" : "Next"}
          </Button>
        ) : (
          <Button variant="contained" onClick={handleComplete} color="success">
            Start Using FinPlan
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
