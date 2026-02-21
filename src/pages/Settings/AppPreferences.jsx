import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { useSettings } from '../../hooks/useSettings';

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '21/02/2026' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '02/21/2026' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2026-02-21' },
];

const NUMBER_FORMATS = [
  { value: 'indian', label: 'Indian', example: '1,00,000' },
  { value: 'international', label: 'International', example: '100,000' },
];

const WEEK_STARTS = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
];

export default function AppPreferences() {
  const { getSetting, setSetting } = useSettings();

  const dateFormat = getSetting('dateFormat', 'DD/MM/YYYY');
  const numberFormat = getSetting('numberFormat', 'indian');
  const weekStart = getSetting('weekStart', 'sunday');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>Date Format</Typography>
        <TextField
          select
          value={dateFormat}
          onChange={(e) => setSetting('dateFormat', e.target.value)}
          size="small"
          fullWidth
        >
          {DATE_FORMATS.map(f => (
            <MenuItem key={f.value} value={f.value}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">{f.label}</Typography>
                <Typography variant="caption" color="text.secondary">{f.example}</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>Number Format</Typography>
        <TextField
          select
          value={numberFormat}
          onChange={(e) => setSetting('numberFormat', e.target.value)}
          size="small"
          fullWidth
        >
          {NUMBER_FORMATS.map(f => (
            <MenuItem key={f.value} value={f.value}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">{f.label}</Typography>
                <Typography variant="caption" color="text.secondary">{f.example}</Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>Start of Week</Typography>
        <TextField
          select
          value={weekStart}
          onChange={(e) => setSetting('weekStart', e.target.value)}
          size="small"
          fullWidth
        >
          {WEEK_STARTS.map(f => (
            <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}
