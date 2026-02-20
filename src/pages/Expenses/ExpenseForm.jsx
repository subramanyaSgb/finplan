import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, InputAdornment, IconButton, Box, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useExpenses } from '../../hooks/useExpenses';
import { COLORS } from '../../theme';

const CURRENCIES = [
  { code: 'INR', symbol: '\u20B9' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '\u20AC' },
  { code: 'GBP', symbol: '\u00A3' },
];

const emptyForm = {
  description: '',
  amount: '',
  category: '',
  currency: 'INR',
  date: '',
  notes: '',
};

export default function ExpenseForm({
  open,
  onClose,
  expense,
  visibleCategories,
  defaultDate,
  onOpenCategoryManager,
}) {
  const { addExpense, updateExpense, deleteExpense } = useExpenses();
  const [form, setForm] = useState(emptyForm);

  const isEdit = Boolean(expense);

  useEffect(() => {
    if (open) {
      if (expense) {
        setForm({
          description: expense.description || '',
          amount: String(expense.amount || ''),
          category: expense.category || visibleCategories[0] || 'Other',
          currency: expense.currency || 'INR',
          date: expense.date || defaultDate,
          notes: expense.notes || '',
        });
      } else {
        setForm({
          ...emptyForm,
          category: visibleCategories[0] || 'Other',
          date: defaultDate,
        });
      }
    }
  }, [open, expense, visibleCategories, defaultDate]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const currencySymbol = CURRENCIES.find((c) => c.code === form.currency)?.symbol || '\u20B9';
  const canSubmit = form.description.trim() && form.amount && visibleCategories.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (isEdit) {
      await updateExpense(expense.id, {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        currency: form.currency,
        date: form.date,
        notes: form.notes.trim(),
      });
    } else {
      await addExpense({
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        category: form.category,
        currency: form.currency,
        date: form.date,
        notes: form.notes.trim(),
      });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (isEdit && expense?.id) {
      await deleteExpense(expense.id);
      onClose();
    }
  };

  // Merge visible cats with expense's category (in case it was hidden later)
  const categoryOptions = isEdit && form.category
    ? [...new Set([...visibleCategories, form.category])]
    : visibleCategories;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          {isEdit ? 'Edit Expense' : 'Add Expense'}
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Description"
          value={form.description}
          onChange={set('description')}
          placeholder="e.g. Lunch at Rameshwaram Cafe"
          autoFocus={!isEdit}
        />

        <TextField
          label="Amount"
          value={form.amount}
          onChange={set('amount')}
          type="number"
          placeholder="0"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">{currencySymbol}</InputAdornment>
              ),
            },
          }}
        />

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Category</Typography>
            {onOpenCategoryManager && (
              <Typography
                variant="caption"
                sx={{ color: COLORS.accentLight, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { onClose(); setTimeout(() => onOpenCategoryManager(), 250); }}
              >
                Manage
              </Typography>
            )}
          </Box>
          {categoryOptions.length > 0 ? (
            <TextField
              select
              value={form.category}
              onChange={set('category')}
              size="small"
            >
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          ) : (
            <Typography variant="body2" sx={{ color: COLORS.textMuted, p: 1.5, bgcolor: COLORS.bgCard, borderRadius: 3, border: `1px solid ${COLORS.border}` }}>
              No visible categories &mdash;{' '}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: COLORS.accentLight, cursor: 'pointer', fontWeight: 600 }}
                onClick={() => { onClose(); setTimeout(() => onOpenCategoryManager(), 250); }}
              >
                manage categories
              </Typography>
            </Typography>
          )}
        </Box>

        <TextField
          select
          label="Currency"
          value={form.currency}
          onChange={set('currency')}
          size="small"
        >
          {CURRENCIES.map((c) => (
            <MenuItem key={c.code} value={c.code}>{c.symbol} {c.code}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Date"
          value={form.date}
          onChange={set('date')}
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Notes (optional)"
          value={form.notes}
          onChange={set('notes')}
          multiline
          minRows={2}
          placeholder="Any additional details..."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {isEdit && (
          <Button
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{ mr: 'auto' }}
          >
            Delete
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
          fullWidth={!isEdit}
          sx={{ py: 1.25 }}
        >
          {isEdit ? 'Save Changes' : 'Add Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
