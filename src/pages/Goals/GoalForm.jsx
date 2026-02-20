import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, Box, Typography, InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../theme';

const COLOR_PRESETS = [
  COLORS.accent, COLORS.green, COLORS.orange,
  COLORS.red, COLORS.purple, COLORS.cyan,
];

const emptyForm = {
  name: '',
  target: '',
  saved: '',
  color: COLORS.accent,
};

export default function GoalForm({ open, onClose, goal, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(emptyForm);
  const isEdit = Boolean(goal);

  useEffect(() => {
    if (open) {
      if (goal) {
        setForm({
          name: goal.name || '',
          target: String(goal.target || ''),
          saved: String(goal.saved || ''),
          color: goal.color || COLORS.accent,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, goal]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const canSubmit = form.name.trim() && form.target;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (isEdit) {
      await onUpdate(goal.id, {
        name: form.name.trim(),
        target: parseFloat(form.target),
        saved: parseFloat(form.saved || 0),
        color: form.color,
      });
    } else {
      await onAdd({
        name: form.name.trim(),
        target: form.target,
        saved: form.saved || '0',
        color: form.color,
      });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (isEdit && goal?.id) {
      await onDelete(goal.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          {isEdit ? 'Edit Goal' : 'New Goal'}
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label="Goal Name"
          value={form.name}
          onChange={set('name')}
          placeholder="e.g. New Laptop"
          autoFocus={!isEdit}
        />

        <TextField
          label="Target Amount"
          value={form.target}
          onChange={set('target')}
          type="number"
          placeholder="0"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
            },
          }}
        />

        <TextField
          label="Already Saved"
          value={form.saved}
          onChange={set('saved')}
          type="number"
          placeholder="0"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
            },
          }}
        />

        {/* Color picker */}
        <Box>
          <Typography variant="caption" sx={{ color: COLORS.textMuted, fontWeight: 500, display: 'block', mb: 0.75 }}>
            Color
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {COLOR_PRESETS.map((c) => (
              <Box
                key={c}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2.5,
                  bgcolor: c,
                  cursor: 'pointer',
                  border: form.color === c ? '3px solid white' : '3px solid transparent',
                  transition: 'border 0.15s ease',
                }}
              />
            ))}
          </Box>
        </Box>
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
          {isEdit ? 'Save Changes' : 'Create Goal'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
