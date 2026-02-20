import {
  Card, CardContent, Box, Typography, Chip, Collapse, IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function BudgetSection({ currentData }) {
  const [open, setOpen] = useState(false);

  const budgetExpenses = currentData.expenses ? Object.entries(currentData.expenses) : [];
  const budgetSavings = currentData.savings ? Object.entries(currentData.savings) : [];

  if (budgetExpenses.length === 0 && budgetSavings.length === 0) return null;

  const budgetTotal =
    budgetExpenses.reduce((s, [, v]) => s + (parseFloat(v) || 0), 0) +
    budgetSavings.reduce((s, [, v]) => s + (parseFloat(v) || 0), 0);

  const itemCount = budgetExpenses.length + budgetSavings.length;

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent
        sx={{
          p: 2, '&:last-child': { pb: 2 }, cursor: 'pointer', userSelect: 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              Monthly Budget Items
            </Typography>
            <Chip
              label={itemCount}
              size="small"
              color="error"
              sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>
              {fmtFull(budgetTotal)}
            </Typography>
            <IconButton size="small" sx={{ p: 0 }}>
              <ExpandMoreIcon
                sx={{
                  fontSize: 20,
                  color: COLORS.textMuted,
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Collapsible content */}
        <Collapse in={open}>
          <Box sx={{ mt: 1.5 }}>
            {/* Expense items */}
            {budgetExpenses.map(([name, val]) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.75,
                  borderBottom: `1px solid ${COLORS.border}30`,
                }}
              >
                <Typography sx={{ fontSize: 13 }}>{name}</Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.red,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmtFull(parseFloat(val) || 0)}
                </Typography>
              </Box>
            ))}

            {/* Savings / investment items */}
            {budgetSavings.map(([name, val]) => (
              <Box
                key={name}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.75,
                  borderBottom: `1px solid ${COLORS.border}30`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography sx={{ fontSize: 13 }}>{name}</Typography>
                  <Chip
                    label="INV"
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: 9,
                      fontWeight: 700,
                      bgcolor: COLORS.greenDim,
                      color: COLORS.green,
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.green,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmtFull(parseFloat(val) || 0)}
                </Typography>
              </Box>
            ))}

            {/* Total */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pt: 1,
                mt: 0.5,
              }}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
                Total
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>
                {fmtFull(budgetTotal)}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
