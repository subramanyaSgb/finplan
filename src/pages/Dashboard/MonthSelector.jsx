import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';

export default function MonthSelector({ onAdd, onEdit }) {
  const { monthlyData, currentMonth, setCurrentMonth, currentData } = useMonthlyData();

  const isFirst = currentMonth === 0;
  const isLast = currentMonth >= monthlyData.length - 1;
  const hasData = monthlyData.length > 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconButton
        onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
        disabled={isFirst || !hasData}
        sx={{
          bgcolor: 'background.paper',
          border: `1px solid ${COLORS.border}`,
          width: 36,
          height: 36,
          '&:hover': { bgcolor: COLORS.bgCardHover },
        }}
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      <Box sx={{ textAlign: 'center', flex: 1 }}>
        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: -0.3 }}>
          {hasData ? currentData.month : 'No Data'}
        </Typography>
        {hasData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5 }}>
            <IconButton size="small" onClick={onEdit} sx={{ color: COLORS.accentLight }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton size="small" onClick={onAdd} sx={{ color: COLORS.green }}>
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      <IconButton
        onClick={() => setCurrentMonth(Math.min(monthlyData.length - 1, currentMonth + 1))}
        disabled={isLast || !hasData}
        sx={{
          bgcolor: 'background.paper',
          border: `1px solid ${COLORS.border}`,
          width: 36,
          height: 36,
          '&:hover': { bgcolor: COLORS.bgCardHover },
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
