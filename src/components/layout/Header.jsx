import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme';

export default function Header() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Box
      sx={{
        px: 2.5, pt: 2, pb: 1,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, bgcolor: COLORS.bg, zIndex: 50,
        borderBottom: `1px solid ${COLORS.border}20`,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
        Fin<Box component="span" sx={{ color: 'primary.main' }}>Plan</Box>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 8, height: 8, borderRadius: '50%',
            bgcolor: isOnline ? 'success.main' : COLORS.orange,
            animation: 'pulse 2s infinite',
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {isOnline ? 'Online' : 'Offline'}
        </Typography>
        <IconButton size="small" onClick={() => navigate('/settings')} sx={{ color: 'text.secondary' }}>
          <SettingsOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
