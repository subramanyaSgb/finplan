import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { COLORS } from '../../theme';
import { fmt } from '../../utils/format';

export default function WealthSnapshot({
  totalFD,
  fdCount,
  totalGoalsSaved,
  totalMF,
  mfCount,
  totalRecurringSavings,
  onOpenFD,
  onOpenMF,
}) {
  const grandTotal = totalFD + totalGoalsSaved + totalRecurringSavings;

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${COLORS.accentDim}80, ${COLORS.purpleDim}80, ${COLORS.bgCard})`,
        border: `1px solid ${COLORS.borderLight}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AccountBalanceIcon sx={{ color: COLORS.accentLight, fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: COLORS.accentLight, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: 12 }}
          >
            Total Wealth Snapshot
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {/* Fixed Deposits */}
          <Box
            onClick={onOpenFD}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          >
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Fixed Deposits ({fdCount})
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.orange }}>
              {fmt(totalFD)}
            </Typography>
          </Box>

          {/* Goal Savings */}
          <Box>
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Goal Savings
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.green }}>
              {fmt(totalGoalsSaved)}
            </Typography>
          </Box>

          {/* MF SIPs */}
          <Box
            onClick={onOpenMF}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          >
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              MF SIPs ({mfCount})
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.cyan }}>
              {fmt(totalMF)}
              <Typography component="span" sx={{ fontSize: 11, color: COLORS.textMuted, ml: 0.25 }}>
                /mo
              </Typography>
            </Typography>
          </Box>

          {/* Recurring Savings */}
          <Box>
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Recurring Savings
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: COLORS.accentLight }}>
              {fmt(totalRecurringSavings)}
            </Typography>
          </Box>

          {/* Grand Total */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Divider sx={{ mb: 1.25, borderColor: `${COLORS.border}40` }} />
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Grand Total (FD + Goals + Savings)
            </Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: COLORS.purple }}>
              {fmt(grandTotal)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
