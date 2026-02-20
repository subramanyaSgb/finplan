import { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function RecurringSavings({
  activeSavings,
  archivedCount,
  savingsAgg,
  onArchive,
  onRestore,
  onOpenArchived,
}) {
  const [detailName, setDetailName] = useState(null);

  const detail = detailName ? savingsAgg[detailName] : null;

  if (activeSavings.length === 0) return null;

  return (
    <>
      <Card sx={{ border: `1px solid ${COLORS.border}` }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Recurring Savings
            </Typography>
            {archivedCount > 0 && (
              <Button
                size="small"
                onClick={onOpenArchived}
                sx={{ fontSize: 11, color: COLORS.textMuted, textTransform: 'none', minWidth: 0 }}
              >
                Archived ({archivedCount})
              </Button>
            )}
          </Box>

          {activeSavings.map(([name, data], i) => {
            const lastMonth = data.months[data.months.length - 1];
            return (
              <Box
                key={name}
                onClick={() => setDetailName(name)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  py: 1.25,
                  borderBottom: `1px solid ${COLORS.border}30`,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: COLORS.bgCardHover },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: PIE_COLORS[i % PIE_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                    {name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                    {data.months.length} months &middot; Last: {lastMonth.month}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
                    {fmtFull(data.total)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                    {fmtFull(lastMonth.amount)}/mo
                  </Typography>
                </Box>
                <ChevronRightIcon sx={{ color: COLORS.textDim, fontSize: 18, flexShrink: 0 }} />
              </Box>
            );
          })}
        </CardContent>
      </Card>

      {/* Savings Detail Dialog */}
      <Dialog open={!!detailName} onClose={() => setDetailName(null)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" fontWeight={700} fontSize={18}>
            {detailName || 'Savings Detail'}
          </Typography>
          <IconButton onClick={() => setDetailName(null)} size="small" edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {detail && (
            <>
              {/* Summary card */}
              <Card
                sx={{
                  mb: 2,
                  background: `linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})`,
                  border: `1px solid ${COLORS.border}`,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                        Total Saved
                      </Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, color: COLORS.green }}>
                        {fmtFull(detail.total)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                        Months Active
                      </Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                        {detail.months.length}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Monthly breakdown */}
              <Typography
                variant="caption"
                sx={{ color: COLORS.textMuted, fontWeight: 600, display: 'block', mb: 1 }}
              >
                MONTHLY BREAKDOWN
              </Typography>

              {detail.months.slice().reverse().map((m, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: `1px solid ${COLORS.border}30`,
                  }}
                >
                  <Typography sx={{ fontSize: 13 }}>{m.month}</Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.green,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {fmtFull(m.amount)}
                  </Typography>
                </Box>
              ))}

              {/* Archive button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  fullWidth
                  startIcon={<ArchiveIcon />}
                  onClick={() => {
                    onArchive(detailName, detail.total);
                    setDetailName(null);
                  }}
                  sx={{ py: 1 }}
                >
                  Mark as Completed &rarr; Archive
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
