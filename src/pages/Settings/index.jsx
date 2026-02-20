import { Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme';

export default function Settings() {
  const navigate = useNavigate();
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', maxWidth: 480, mx: 'auto' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', alignItems: 'center', gap: 1, borderBottom: `1px solid ${COLORS.border}20` }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>Settings</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography color="text.secondary">Settings coming soon.</Typography>
      </Box>
    </Box>
  );
}
