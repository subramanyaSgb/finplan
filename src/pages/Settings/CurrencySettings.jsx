import { Box, Typography, TextField, MenuItem } from '@mui/material';
import { useSettings } from '../../hooks/useSettings';
import { CURRENCIES, getCurrencySymbol } from '../../utils/currency';
import { COLORS } from '../../theme';

export default function CurrencySettings() {
  const { defaultCurrency, setSetting } = useSettings();

  const handleChange = (e) => {
    setSetting('defaultCurrency', e.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography variant="body1" fontWeight={600}>Default Currency</Typography>
          <Typography variant="caption" color="text.secondary">
            Used for all new entries
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ color: COLORS.accent }}>
          {getCurrencySymbol(defaultCurrency)} {defaultCurrency}
        </Typography>
      </Box>
      <TextField
        select
        value={defaultCurrency}
        onChange={handleChange}
        size="small"
        fullWidth
      >
        {CURRENCIES.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
              <Typography fontWeight={700} sx={{ minWidth: 28 }}>{c.symbol}</Typography>
              <Typography>{c.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {c.code}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
