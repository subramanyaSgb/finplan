import { useMemo } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { MONTHS } from '../../utils/format';

export default function DateRangeFilter({ monthlyData, fromIdx, toIdx, onFromChange, onToChange }) {
  const options = useMemo(() =>
    monthlyData.map((m, i) => ({ label: m.month, value: i })),
    [monthlyData],
  );

  if (options.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>From</InputLabel>
        <Select
          value={fromIdx}
          label="From"
          onChange={(e) => onFromChange(e.target.value)}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value} disabled={o.value > toIdx}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="body2" color="text.secondary">to</Typography>

      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>To</InputLabel>
        <Select
          value={toIdx}
          label="To"
          onChange={(e) => onToChange(e.target.value)}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value} disabled={o.value < fromIdx}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
