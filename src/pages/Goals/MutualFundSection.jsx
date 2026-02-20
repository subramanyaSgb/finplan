import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, Typography, Box, Button, IconButton,
  TextField, InputAdornment, Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

const emptyForm = { name: '', amount: '' };

export default function MutualFundSection({
  open,
  onClose,
  mutualFunds,
  totalMF,
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

  const openEdit = (mf) => {
    setEditId(mf.id);
    setForm({ name: mf.name, amount: String(mf.amount) });
    setMode('edit');
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.amount) return;
    await onAdd({ name: form.name.trim(), amount: form.amount });
    setForm(emptyForm);
    setMode('list');
  };

  const handleSaveEdit = async () => {
    if (!form.name.trim() || !form.amount) return;
    await onUpdate(editId, {
      name: form.name.trim(),
      amount: parseFloat(form.amount),
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

  const canSubmit = form.name.trim() && form.amount;

  const pieData = mutualFunds.map((mf, i) => ({
    name: mf.name,
    value: mf.amount,
    color: mf.color || PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Form view (add/edit)
  if (mode === 'add' || mode === 'edit') {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700} fontSize={18}>
            {mode === 'add' ? 'Add SIP' : 'Edit SIP'}
          </Typography>
          <IconButton onClick={() => setMode('list')} size="small" edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
          <TextField
            label="Fund Name"
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Quant Small Cap Fund"
            autoFocus
          />
          <TextField
            label="Monthly SIP Amount"
            value={form.amount}
            onChange={set('amount')}
            type="number"
            placeholder="e.g. 1000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">&#8377;</InputAdornment>,
              },
            }}
          />
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
            {mode === 'add' ? 'Add SIP' : 'Save Changes'}
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
          Mutual Fund Portfolio
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAdd}
            sx={{ fontSize: 12 }}
          >
            Add SIP
          </Button>
        </Box>

        {mutualFunds.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: COLORS.textDim }}>
            <Typography sx={{ fontSize: 36, mb: 1 }}>&#128200;</Typography>
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>No SIPs yet</Typography>
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Add your first mutual fund SIP
            </Typography>
          </Box>
        ) : (
          <>
            {/* Pie Chart */}
            {pieData.length > 0 && (
              <Box sx={{ width: '100%', height: 160, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Fund List */}
            {mutualFunds.map((mf, i) => (
              <Card key={mf.id} sx={{ mb: 1, border: `1px solid ${COLORS.border}` }}>
                <CardContent sx={{ py: '10px !important', px: 1.75 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: 0.75,
                          bgcolor: mf.color || PIE_COLORS[i % PIE_COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {mf.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        {fmtFull(mf.amount)}/mo
                      </Typography>
                      <IconButton size="small" onClick={() => openEdit(mf)} sx={{ color: COLORS.textMuted }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(mf.id)}
                        sx={{ color: COLORS.textDim }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={deleteConfirm === mf.id}>
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
                        Remove this SIP?
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Button size="small" onClick={() => setDeleteConfirm(null)} sx={{ fontSize: 11 }}>
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDelete(mf.id)}
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

            {/* Total */}
            <Card
              sx={{
                mt: 0.5,
                bgcolor: COLORS.accentDim + '40',
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <CardContent sx={{ py: '10px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: COLORS.accentLight }}>
                    Total Monthly SIP
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLORS.white }}>
                    {fmtFull(totalMF)}
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
