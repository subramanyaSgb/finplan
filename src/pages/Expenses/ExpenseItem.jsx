import { useState } from 'react';
import { Card, CardContent, Box, Typography, IconButton, Chip, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Card sx={{ mb: 0.75 }}>
      <CardContent sx={{ p: '12px 14px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left side: description + category */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {expense.description}
            </Typography>
            <Chip
              label={expense.category}
              size="small"
              sx={{
                mt: 0.5,
                height: 20,
                fontSize: 10,
                fontWeight: 600,
                bgcolor: COLORS.bgCardHover,
                color: COLORS.textMuted,
              }}
            />
          </Box>

          {/* Right side: amount + actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0, ml: 1 }}>
            <Typography
              sx={{
                color: COLORS.red,
                fontSize: 15,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {fmtFull(expense.amount, expense.currency === 'USD' ? '$' : expense.currency === 'EUR' ? '\u20AC' : expense.currency === 'GBP' ? '\u00A3' : '\u20B9')}
            </Typography>
            <IconButton size="small" onClick={() => onEdit(expense)} sx={{ color: COLORS.textMuted }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={() => setShowConfirm(true)} sx={{ color: COLORS.textDim }}>
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Delete confirmation */}
        {showConfirm && (
          <Box
            sx={{
              mt: 1,
              p: '8px 12px',
              bgcolor: COLORS.redBg,
              border: `1px solid ${COLORS.red}30`,
              borderRadius: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 12, color: COLORS.red, fontWeight: 500 }}>
              Delete this expense?
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Button
                size="small"
                onClick={() => setShowConfirm(false)}
                sx={{ fontSize: 12, px: 1.25, minWidth: 'auto' }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => { onDelete(expense.id); setShowConfirm(false); }}
                sx={{ fontSize: 12, px: 1.25, minWidth: 'auto' }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
