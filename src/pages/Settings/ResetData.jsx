import { useState } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { db } from '../../db';
import { useSnackbar } from '../../context/SnackbarContext';
import { COLORS } from '../../theme';

export default function ResetData() {
  const showSnackbar = useSnackbar();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    try {
      setDeleting(true);
      await Promise.all([
        db.monthlyData.clear(),
        db.expenses.clear(),
        db.goals.clear(),
        db.mutualFunds.clear(),
        db.fixedDeposits.clear(),
        db.reminders.clear(),
        db.recurringRules.clear(),
        db.categories.clear(),
        db.archivedSavings.clear(),
        db.settings.clear(),
      ]);
      showSnackbar('All data has been deleted. Reloading...');
      setConfirmOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showSnackbar('Failed to delete data: ' + err.message, 'error');
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteForeverIcon />}
        onClick={() => setConfirmOpen(true)}
        fullWidth
        sx={{
          py: 1.25, justifyContent: 'flex-start',
          borderColor: `${COLORS.red}40`,
          '&:hover': { borderColor: COLORS.red, bgcolor: `${COLORS.red}10` },
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600} color="error">
            Delete All Data
          </Typography>
          <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
            Permanently remove all app data
          </Typography>
        </Box>
      </Button>

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700, color: COLORS.red }}>
          Delete All Data?
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1, mb: 2,
            p: 1.5, borderRadius: 2,
            bgcolor: `${COLORS.red}15`, border: `1px solid ${COLORS.red}30`,
          }}>
            <WarningAmberIcon sx={{ color: COLORS.red }} />
            <Typography variant="body2" sx={{ color: COLORS.red, fontWeight: 600 }}>
              This action is permanent and cannot be undone!
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2, color: COLORS.textMuted }}>
            <Typography component="li" variant="body2">All monthly income and budget data</Typography>
            <Typography component="li" variant="body2">All expenses and categories</Typography>
            <Typography component="li" variant="body2">All goals, mutual funds, and fixed deposits</Typography>
            <Typography component="li" variant="body2">All reminders and recurring rules</Typography>
            <Typography component="li" variant="body2">All settings and preferences</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAll}
            disabled={deleting}
            startIcon={<DeleteForeverIcon />}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
