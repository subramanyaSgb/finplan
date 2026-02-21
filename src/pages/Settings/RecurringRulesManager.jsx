import { useState } from 'react';
import {
  Box, Typography, Button, IconButton, Switch, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useRecurring } from '../../hooks/useRecurring';
import { useAppState } from '../../context/AppContext';
import { useSettings } from '../../hooks/useSettings';
import { getCurrencySymbol } from '../../utils/currency';
import { COLORS } from '../../theme';

const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'savings', label: 'Savings' },
];

const emptyForm = {
  type: 'expense',
  category: '',
  amount: '',
  frequency: 'monthly',
  nextDate: new Date().toISOString().slice(0, 10),
  description: '',
};

export default function RecurringRulesManager() {
  const { recurringRules, addRule, updateRule, toggleRule, deleteRule } = useRecurring();
  const { categories } = useAppState();
  const { defaultCurrency } = useSettings();
  const symbol = getCurrencySymbol(defaultCurrency);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const visibleCategories = categories.filter(c => c.visible !== false).map(c => c.name);

  const openAdd = () => {
    setEditingRule(null);
    setForm({
      ...emptyForm,
      category: visibleCategories[0] || '',
    });
    setDialogOpen(true);
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    setForm({
      type: rule.type || 'expense',
      category: rule.category || '',
      amount: String(rule.amount || ''),
      frequency: rule.frequency || 'monthly',
      nextDate: rule.nextDate || new Date().toISOString().slice(0, 10),
      description: rule.description || '',
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingRule(null);
  };

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const canSubmit = form.category && form.amount && parseFloat(form.amount) > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const payload = {
      type: form.type,
      category: form.category,
      amount: form.amount,
      frequency: form.frequency,
      nextDate: form.nextDate,
      description: form.description.trim(),
    };
    if (editingRule) {
      await updateRule(editingRule.id, payload);
    } else {
      await addRule(payload);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteRule(id);
    setDeleteConfirm(null);
  };

  const formatFrequency = (freq) => {
    const f = FREQUENCIES.find(fr => fr.value === freq);
    return f ? f.label : freq;
  };

  return (
    <Box>
      {recurringRules.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <RepeatIcon sx={{ fontSize: 40, color: COLORS.textDim, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No recurring rules yet
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Automate regular expenses and savings
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {recurringRules.map((rule) => (
            <Box
              key={rule.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                p: 1.5, borderRadius: 2,
                bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
                opacity: rule.isActive ? 1 : 0.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {rule.description || rule.category}
                  </Typography>
                  <Chip
                    label={rule.type === 'savings' ? 'Savings' : 'Expense'}
                    size="small"
                    sx={{
                      height: 20, fontSize: 10, fontWeight: 700,
                      bgcolor: rule.type === 'savings' ? `${COLORS.green}20` : `${COLORS.orange}20`,
                      color: rule.type === 'savings' ? COLORS.green : COLORS.orange,
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {symbol}{Number(rule.amount).toLocaleString()} &middot; {formatFrequency(rule.frequency)}
                  {rule.nextDate && ` &middot; Next: ${rule.nextDate}`}
                </Typography>
              </Box>
              <Switch
                size="small"
                checked={rule.isActive !== false}
                onChange={() => toggleRule(rule.id)}
                color="primary"
              />
              <IconButton size="small" onClick={() => openEdit(rule)} sx={{ color: COLORS.textMuted }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setDeleteConfirm(rule.id)} sx={{ color: COLORS.red }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={openAdd}
        fullWidth
        sx={{ py: 1 }}
      >
        Add Recurring Rule
      </Button>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700} fontSize={18}>
            {editingRule ? 'Edit Rule' : 'Add Recurring Rule'}
          </Typography>
          <IconButton onClick={handleClose} size="small" edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            select
            label="Type"
            value={form.type}
            onChange={set('type')}
            size="small"
          >
            {TYPES.map(t => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            value={form.category}
            onChange={set('category')}
            size="small"
          >
            {visibleCategories.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description (optional)"
            value={form.description}
            onChange={set('description')}
            placeholder="e.g. Netflix subscription"
          />

          <TextField
            label="Amount"
            value={form.amount}
            onChange={set('amount')}
            type="number"
            placeholder="0"
          />

          <TextField
            select
            label="Frequency"
            value={form.frequency}
            onChange={set('frequency')}
            size="small"
          >
            {FREQUENCIES.map(f => (
              <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Start / Next Date"
            value={form.nextDate}
            onChange={set('nextDate')}
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit}>
            {editingRule ? 'Save Changes' : 'Add Rule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm !== null} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Rule?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This recurring rule will be permanently removed. Any existing transactions
            created by this rule will not be affected.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(deleteConfirm)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
