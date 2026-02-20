import {
  Dialog, DialogTitle, DialogContent,
  Typography, Box, Button, IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function ArchivedSavings({
  open,
  onClose,
  archivedSavingsList,
  onRestore,
  onOpenDetail,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          Archived Savings
        </Typography>
        <IconButton onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {archivedSavingsList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: COLORS.textDim }}>
            <Typography sx={{ fontSize: 36, mb: 1 }}>&#128230;</Typography>
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>No archived items</Typography>
            <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
              Completed savings will appear here
            </Typography>
          </Box>
        ) : (
          archivedSavingsList.map(([name, data]) => (
            <Box
              key={name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                py: 1.25,
                borderBottom: `1px solid ${COLORS.border}30`,
              }}
            >
              <Box
                sx={{ flex: 1, cursor: 'pointer' }}
                onClick={() => {
                  if (onOpenDetail) {
                    onClose();
                    setTimeout(() => onOpenDetail(name), 250);
                  }
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: COLORS.textDim }}>
                  {name}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                  {data.months.length} months &middot; {fmtFull(data.total)}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RestoreIcon />}
                onClick={() => onRestore(name)}
                sx={{ fontSize: 11, py: 0.5, textTransform: 'none' }}
              >
                Restore
              </Button>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
}
