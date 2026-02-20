import { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Typography, Box, Divider, Card, CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import { uid, fmtFull } from '../../utils/format';

const DEFAULT_INC = [
  { name: 'Salary', amount: '' },
  { name: 'Reimbursement', amount: '' },
  { name: 'FD Return', amount: '' },
];
const DEFAULT_EXP = [
  { name: 'Home', amount: '' },
  { name: 'House Rent', amount: '' },
  { name: 'ICICI Mine', amount: '' },
  { name: 'Axis', amount: '' },
  { name: 'Jupiter', amount: '' },
  { name: 'Rupay ICICI', amount: '' },
];
const DEFAULT_SAV = [
  { name: 'LIC', amount: '' },
  { name: 'Saving RD', amount: '' },
];

function addIds(arr) {
  return arr.map((r) => ({ ...r, id: uid() }));
}

export default function MonthFormDialog({ open, onClose, editMode }) {
  const {
    currentData, monthlyData, nextMonthLabel,
    addMonth, updateMonth, deleteMonth,
  } = useMonthlyData();

  const [monthLabel, setMonthLabel] = useState('');
  const [incRows, setIncRows] = useState([]);
  const [expRows, setExpRows] = useState([]);
  const [savRows, setSavRows] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Initialize form when dialog opens
  useEffect(() => {
    if (!open) {
      setConfirmDelete(false);
      return;
    }

    if (editMode && currentData) {
      // Edit mode: pre-fill from currentData
      setMonthLabel(currentData.month || '');

      // Build income rows
      const incArr = [];
      if (currentData.income && typeof currentData.income === 'object' && Object.keys(currentData.income).length > 0) {
        Object.entries(currentData.income).forEach(([name, amount]) =>
          incArr.push({ id: uid(), name, amount: String(amount) })
        );
      } else {
        if (currentData.salary) incArr.push({ id: uid(), name: 'Salary', amount: String(currentData.salary) });
        if (currentData.reimbursement) incArr.push({ id: uid(), name: 'Reimbursement', amount: String(currentData.reimbursement) });
        if (currentData.fdReturn) incArr.push({ id: uid(), name: 'FD Return', amount: String(currentData.fdReturn) });
        if (currentData.otherIncome) incArr.push({ id: uid(), name: 'Other Income', amount: String(currentData.otherIncome) });
      }
      if (incArr.length === 0) incArr.push({ id: uid(), name: 'Salary', amount: '' });
      setIncRows(incArr);

      // Build expense rows
      const expArr = Object.entries(currentData.expenses || {}).map(([name, amount]) => ({
        id: uid(), name, amount: String(amount),
      }));
      if (expArr.length === 0) expArr.push({ id: uid(), name: '', amount: '' });
      setExpRows(expArr);

      // Build savings rows
      const savArr = Object.entries(currentData.savings || {}).map(([name, amount]) => ({
        id: uid(), name, amount: String(amount),
      }));
      if (savArr.length === 0) savArr.push({ id: uid(), name: '', amount: '' });
      setSavRows(savArr);
    } else {
      // Add mode: defaults
      setMonthLabel(nextMonthLabel());
      setIncRows(addIds(DEFAULT_INC));
      setExpRows(addIds(DEFAULT_EXP));
      setSavRows(addIds(DEFAULT_SAV));
    }
    setConfirmDelete(false);
  }, [open, editMode, currentData, nextMonthLabel]);

  // Row manipulation helpers
  const addRow = (setter) => () => setter((r) => [...r, { id: uid(), name: '', amount: '' }]);

  const removeRow = (setter) => (rowId) =>
    setter((r) => (r.length <= 1 ? r : r.filter((rr) => rr.id !== rowId)));

  const updateRow = (setter) => (rowId, field, value) =>
    setter((r) => r.map((rr) => (rr.id === rowId ? { ...rr, [field]: value } : rr)));

  // Build month data from form state
  const buildMonthData = () => {
    const incObj = {};
    incRows.forEach((r) => {
      if (r.name && r.amount) incObj[r.name] = parseFloat(r.amount);
    });
    const totalIncome = Object.values(incObj).reduce((s, v) => s + v, 0);
    const salary = incObj['Salary'] || 0;

    const expObj = {};
    expRows.forEach((r) => {
      if (r.name && r.amount) expObj[r.name] = parseFloat(r.amount);
    });

    const savObj = {};
    savRows.forEach((r) => {
      if (r.name && r.amount) savObj[r.name] = parseFloat(r.amount);
    });

    const totalExpenses =
      Object.values(expObj).reduce((s, v) => s + v, 0) +
      Object.values(savObj).reduce((s, v) => s + v, 0);
    const left = totalIncome - totalExpenses;

    return {
      month: monthLabel,
      salary,
      income: incObj,
      totalIncome,
      expenses: expObj,
      savings: savObj,
      totalExpenses,
      left,
    };
  };

  // Preview calculation
  const preview = useMemo(() => {
    const hasAnyValue = incRows.some((r) => r.amount) || expRows.some((r) => r.amount);
    if (!hasAnyValue) return null;
    return buildMonthData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incRows, expRows, savRows, monthLabel]);

  const handleSave = () => {
    const data = buildMonthData();
    if (!data.month || data.totalIncome === 0) return;

    if (editMode) {
      updateMonth(data);
    } else {
      addMonth(data);
    }
    onClose();
  };

  const handleDelete = () => {
    deleteMonth();
    onClose();
  };

  const canSave = incRows.some((r) => r.amount);

  // Render dynamic rows section
  const renderSection = (label, color, rows, setter, placeholder) => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
        <Typography variant="caption" fontWeight={600} sx={{ color, fontSize: 13 }}>
          {label}
        </Typography>
        <Button
          size="small"
          onClick={addRow(setter)}
          sx={{
            minWidth: 'auto',
            px: 1.25,
            py: 0.25,
            fontSize: 11,
            color: COLORS.accentLight,
            bgcolor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            '&:hover': { bgcolor: COLORS.bgCardHover },
          }}
        >
          + Row
        </Button>
      </Box>

      {rows.map((row) => (
        <Box key={row.id} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
          <TextField
            value={row.name}
            onChange={(e) => updateRow(setter)(row.id, 'name', e.target.value)}
            placeholder={placeholder}
            sx={{ flex: 1 }}
          />
          <TextField
            type="number"
            value={row.amount}
            onChange={(e) => updateRow(setter)(row.id, 'amount', e.target.value)}
            placeholder="Amount"
            sx={{ width: 110 }}
          />
          <IconButton
            size="small"
            onClick={() => removeRow(setter)(row.id)}
            disabled={rows.length <= 1}
            sx={{ color: rows.length <= 1 ? COLORS.border : COLORS.textDim }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {editMode ? `Edit ${currentData.month}` : `Add ${monthLabel || 'New Month'}`}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: COLORS.textMuted }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        {/* Month label (only for add mode) */}
        {!editMode && (
          <TextField
            label="Month Label"
            value={monthLabel}
            onChange={(e) => setMonthLabel(e.target.value)}
            placeholder="e.g. Apr 2026"
            sx={{ mt: 1 }}
          />
        )}

        {/* Income section */}
        {renderSection('Income', COLORS.accentLight, incRows, setIncRows, 'Source (e.g. Salary)')}

        {/* Expenses section */}
        {renderSection('Expenses', COLORS.red, expRows, setExpRows, 'Category')}

        {/* Savings section */}
        {renderSection('Savings & Investments', COLORS.green, savRows, setSavRows, 'Fund / RD')}

        {/* Preview */}
        {preview && (
          <Card sx={{ mt: 2, bgcolor: COLORS.bg, border: `1px solid ${COLORS.border}` }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ color: COLORS.textMuted, mb: 0.75, display: 'block' }}
              >
                PREVIEW
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                    Income
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.accentLight }}>
                    {fmtFull(preview.totalIncome)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                    Expenses
                  </Typography>
                  <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.red }}>
                    {fmtFull(preview.totalExpenses)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                    Left
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ color: preview.left >= 0 ? COLORS.green : COLORS.red }}
                  >
                    {fmtFull(preview.left)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {editMode && (
          <>
            {!confirmDelete ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmDelete(true)}
                startIcon={<DeleteOutlineIcon />}
                sx={{ mr: 'auto' }}
              >
                Delete
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setConfirmDelete(false)}
                  sx={{ color: COLORS.textMuted }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
              </Box>
            )}
          </>
        )}
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave}
          sx={{ flex: editMode ? 0 : 1 }}
          fullWidth={!editMode}
        >
          {editMode ? 'Save Changes' : 'Add Month'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
