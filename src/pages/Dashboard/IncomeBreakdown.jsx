import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function IncomeBreakdown() {
  const { currentData, calcIncome } = useMonthlyData();

  const isNewFormat =
    currentData.income &&
    typeof currentData.income === 'object' &&
    Object.keys(currentData.income).length > 0;

  let items = [];

  if (isNewFormat) {
    items = Object.entries(currentData.income)
      .filter(([, v]) => v > 0)
      .map(([name, amount]) => ({ name, amount: parseFloat(amount) || 0 }));
  } else {
    if (currentData.salary) items.push({ name: 'Salary', amount: currentData.salary });
    if (currentData.reimbursement) items.push({ name: 'Reimbursement', amount: currentData.reimbursement });
    if (currentData.fdReturn) items.push({ name: 'FD Return', amount: currentData.fdReturn });
    if (currentData.otherIncome) items.push({ name: 'Other Income', amount: currentData.otherIncome });
  }

  const total = calcIncome(currentData);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Income
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textDim }}>
            No income data this month
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Income
        </Typography>

        {items.map((item) => (
          <Box
            key={item.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.75,
            }}
          >
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {fmtFull(item.amount)}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.accentLight }}>
            Total
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.accentLight, fontVariantNumeric: 'tabular-nums' }}>
            {fmtFull(total)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
