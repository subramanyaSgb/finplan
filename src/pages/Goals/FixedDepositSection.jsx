import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, Typography, Box, Button, IconButton,
  TextField, MenuItem, InputAdornment, Chip, Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'matured', label: 'Matured' },
  { value: 'received', label: 'Received' },
];

const STATUS_COLORS = {
  active: COLORS.accent,
  matured: COLORS.orange,
  received: COLORS.green,
};

const emptyForm = { bank: '', amount: '', maturity: '', status: 'active' };

export default function FixedDepositSection({
  open,
  onClose,
  fixedDeposits,
  totalFD,
  onAdd,
  onUpdate,
  onDelete,
}) {
  const [mode, setMode] = useState('list'); // 'list' | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (open) {
      setMode('list');
      setForm(emptyForm);
      setEditId(null);
      setDeleteConfirm(null);
    }
  }, [open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const openAdd = () => {
    setForm(emptyForm);
    setMode('add');
  };

  const openEdit = (fd) => {
    setEditId(fd.id);
    setForm({
      bank: fd.bank,
      amount: String(fd.amount),
      maturity: fd.maturity || '',
      status: fd.status || 'active',
    });
    setMode('edit');
  };

  const handleAdd = async () => {
    if (!form.bank.trim() || !form.amount) return;
    await onAdd({
      bank: form.bank.trim(),
      amount: form.amount,
      maturity: form.maturity,
      status: form.status,
    });
    setForm(emptyForm);
    setMode('list');
  };

  const handleSaveEdit = async () => {
    if (!form.bank.trim() || !form.amount) return;
    await onUpdate(editId, {
      bank: form.bank.trim(),
      amount: parseFloat(form.amount),
      maturity: form.maturity,
      status: form.status,
    });
    setForm(emptyForm);
    setEditId(null);
    setMode('list');
  };

  const handleDelete = async (id) => {
    await onDelete(id);
    setDeleteConfirm(null);
    if (mode === 'edit') {
      setMode('list');
      setEditId(null);
      setForm(emptyForm);
    }
  };

  const canSubmit = form.bank.trim() && form.amount;

  // Group FDs by status
  const grouped = { active: [], matured: [], received: [] };
  fixedDeposits.forEach((fd) => {
    const status = fd.status || 'active';
    if (grouped[status]) grouped[status].push(fd);
    else grouped.active.push(fd);
  });

  // Form view (add/edit)
  if (mode === 'add' || mode === 'edit') {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700} fontSize={18}>
            {mode === 'add' ? 'Add Fixed Deposit' : 'Edit Fixed Deposit'}
          </Typography>
          <IconButton onClick={() => setMode('list')} size="small" edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Bank / Institution"
            value={form.bank}
            onChange={set('bank')}
            placeholder="e.g. ICICI, KPSSN, Jupiter"
            autoFocus
          />
          <TextField
            label="Amount"
            value={form.amount}
            onChange={set('amount')}
            type="number"
            placeholder="e.g. 50000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
              },
            }}
          />
          <TextField
            label="Maturity Date"
            value={form.maturity}
            onChange={set('maturity')}
            placeholder="e.g. 15 Mar 2026"
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={set('status')}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          {mode === 'edit' && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(editId)}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            onClick={mode === 'add' ? handleAdd : handleSaveEdit}
            disabled={!canSubmit}
            fullWidth={mode === 'add'}
            sx={{ py: 1.25 }}
          >
            {mode === 'add' ? 'Add FD' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // List view
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          Fixed Deposits
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
            {fixedDeposits.length} FDs &middot; Total: {fmtFull(totalFD)}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ fontSize: 12 }}
          >
            Add FD
          </Button>
        </Box>

        {fixedDeposits.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: COLORS.textDim }}>
            <Typography sx={{ fontSize: 36, mb: 1 }}>&#127974;</Typography>
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>No Fixed Deposits</Typography>
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Add your first FD to track maturity
            </Typography>
          </Box>
        ) : (
          <>
            {/* Render each status group */}
            {['active', 'matured', 'received'].map((status) => {
              const items = grouped[status];
              if (items.length === 0) return null;
              return (
                <Box key={status} sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: STATUS_COLORS[status],
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      display: 'block',
                      mb: 0.75,
                    }}
                  >
                    {status} ({items.length})
                  </Typography>

                  {items.map((fd) => (
                    <Card key={fd.id} sx={{ mb: 1, border: `1px solid ${COLORS.border}` }}>
                      <CardContent sx={{ py: '10px !important', px: 1.75 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                              {fd.bank}
                            </Typography>
                            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                              {fd.maturity || 'No maturity date'}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                                {fmtFull(fd.amount)}
                              </Typography>
                              <Chip
                                label={fd.status || 'active'}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: 10,
                                  fontWeight: 600,
                                  bgcolor: STATUS_COLORS[fd.status || 'active'] + '20',
                                  color: STATUS_COLORS[fd.status || 'active'],
                                }}
                              />
                            </Box>
                            <IconButton size="small" onClick={() => openEdit(fd)} sx={{ color: COLORS.textMuted }}>
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => setDeleteConfirm(fd.id)}
                              sx={{ color: COLORS.textDim }}
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>

                        <Collapse in={deleteConfirm === fd.id}>
                          <Box
                            sx={{
                              mt: 1,
                              p: 1,
                              bgcolor: COLORS.redBg,
                              border: `1px solid ${COLORS.red}30`,
                              borderRadius: 2,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: COLORS.red, fontWeight: 500 }}>
                              Delete this FD?
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.75 }}>
                              <Button size="small" onClick={() => setDeleteConfirm(null)} sx={{ fontSize: 11 }}>
                                Cancel
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                variant="contained"
                                onClick={() => handleDelete(fd.id)}
                                sx={{ fontSize: 11 }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              );
            })}

            {/* Total */}
            <Card
              sx={{
                bgcolor: COLORS.orangeDim + '40',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <CardContent sx={{ py: '10px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.orange }}>
                    Total Fixed Deposits
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>
                    {fmtFull(totalFD)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
