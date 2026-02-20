import { Box, Typography } from '@mui/material';
import { COLORS } from '../../theme';
import { fmtDate, fmtFull } from '../../utils/format';
import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ grouped, sortedDates, search, total, onEdit, onDelete }) {
  return (
    <Box>
      {/* Header */}
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Quick-Added ({total})
        {search && (
          <Typography component="span" sx={{ fontWeight: 400, color: COLORS.textMuted, fontSize: 13 }}>
            {' '}&middot; matching &ldquo;{search}&rdquo;
          </Typography>
        )}
      </Typography>

      {/* Empty state */}
      {sortedDates.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: 36, mb: 1 }}>{'\uD83D\uDCDD'}</Typography>
          <Typography fontWeight={600} sx={{ mb: 0.5 }}>
            {search ? 'No matches' : 'No quick-added expenses'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {search ? `No expenses match "${search}"` : 'Tap + Add to track an expense'}
          </Typography>
        </Box>
      )}

      {/* Grouped by date */}
      {sortedDates.map((date) => {
        const items = grouped[date];
        const dayTotal = items.reduce((s, e) => s + (e.amount || 0), 0);
        return (
          <Box key={date} sx={{ mb: 1.75 }}>
            {/* Date header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
              <Typography sx={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, letterSpacing: 0.3 }}>
                {fmtDate(date)}
              </Typography>
              <Typography sx={{ fontSize: 11, color: COLORS.red, fontWeight: 600 }}>
                {fmtFull(dayTotal)}
              </Typography>
            </Box>

            {/* Expense items */}
            {items.map((e) => (
              <ExpenseItem
                key={e.id}
                expense={e}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
