import { Typography, Box } from '@mui/material';
import { useMonthlyData } from '../../hooks/useMonthlyData';

export default function Dashboard() {
  const { currentData } = useMonthlyData();
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>Dashboard</Typography>
      <Typography color="text.secondary">
        {currentData.month || 'No data yet. Add your first month to get started.'}
      </Typography>
    </Box>
  );
}
