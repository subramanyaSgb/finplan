import { useState, useEffect } from 'react';
import { Box, Button, Typography, Slide } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { COLORS } from '../theme';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShow(false);
  };

  if (!show) return null;

  return (
    <Slide direction="down" in={show} mountOnEnter unmountOnExit>
      <Box sx={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, zIndex: 100,
        background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.purpleDim})`,
        borderBottom: `1px solid ${COLORS.accent}40`,
        px: 2, py: 1.5,
        display: 'flex', alignItems: 'center', gap: 1,
      }}>
        <GetAppIcon sx={{ color: COLORS.accentLight, fontSize: 20 }} />
        <Typography flex={1} fontSize={13} fontWeight={500} color="text.primary">
          Install FinPlan for quick access
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={handleInstall}
          sx={{ fontSize: 11, py: 0.5, px: 1.5, minWidth: 0 }}
        >
          Install
        </Button>
        <IconButton size="small" onClick={() => setShow(false)} sx={{ color: COLORS.textMuted }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Slide>
  );
}
