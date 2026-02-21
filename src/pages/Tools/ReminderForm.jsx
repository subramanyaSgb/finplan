import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, InputAdornment, IconButton, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../theme';

const CATEGORIES = ['Bill', 'EMI', 'Insurance', 'Subscription', 'Investment', 'Other'];
const DUE_DATES = Array.from({ length: 28 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}`,
}));

const emptyForm = { name: '', amount: '', dueDate: '1', category: 'Bill' };

export default function ReminderForm({ open, onClose, reminder, onSave, onDelete }) {
  const [form, setForm] = useState(emptyForm);

  const isEdit = Boolean(reminder);

  useEffect(() => {
    if (open) {
      if (reminder) {
        setForm({
          name: reminder.name || '',
          amount: String(reminder.amount || ''),
          dueDate: reminder.dueDate || '1',
          category: reminder.category || 'Bill',
        });
      } else {
        setForm({ ...emptyForm });
      }
    }
  }, [open, reminder]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const canSubmit = form.name.trim() && form.amount;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name: form.name.trim(),
      amount: form.amount,
      dueDate: form.dueDate,
      category: form.category,
    });
  };

  const handleDelete = () => {
    if (isEdit && reminder?.id && onDelete) {
      onDelete(reminder.id);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}
      >
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          {isEdit ? 'Edit Bill Reminder' : 'Add Bill Reminder'}
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Bill Name"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. ICICI Credit Card"
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
              startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
            },
          }}
        />

        <TextField
          select
          label="Due Date (Day of Month)"
          value={form.dueDate}
          onChange={set('dueDate')}
        >
          {DUE_DATES.map((d) => (
            <MenuItem key={d.value} value={d.value}>
              {d.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Category"
          value={form.category}
          onChange={set('category')}
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
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
          {isEdit ? 'Save Changes' : 'Add Reminder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
