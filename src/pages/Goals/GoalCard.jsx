import { useState } from 'react';
import {
  Card, CardContent, Typography, Box, LinearProgress,
  Button, Chip, IconButton, Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import { COLORS } from '../../theme';
import { fmtFull, pct } from '../../utils/format';

export default function GoalCard({ goal, onEdit, onUpdateSaved, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const progress = pct(goal.saved, goal.target);
  const remaining = Math.max(0, goal.target - goal.saved);
  const isCompleted = progress >= 100;

  return (
    <Card sx={{ border: `1px solid ${COLORS.border}` }}>
      <CardContent sx={{ pb: '12px !important' }}>
        {/* Header: name + status badge */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: 2,
                bgcolor: (goal.color || COLORS.accent) + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FlagIcon sx={{ fontSize: 16, color: goal.color || COLORS.accent }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {goal.name}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                Target: {fmtFull(goal.target)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={isCompleted ? 'Done' : `${progress}%`}
            size="small"
            sx={{
              bgcolor: isCompleted ? COLORS.greenDim : COLORS.orangeDim,
              color: isCompleted ? COLORS.green : COLORS.orange,
              fontWeight: 700,
              fontSize: 12,
              height: 24,
            }}
          />
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={Math.min(100, progress)}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: COLORS.border,
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              bgcolor: goal.color || COLORS.accent,
            },
          }}
        />

        {/* Saved / Need */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: COLORS.green, fontWeight: 500 }}>
            Saved: {fmtFull(goal.saved)}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.red, fontWeight: 500 }}>
            Need: {fmtFull(remaining)}
          </Typography>
        </Box>

        {/* Sources list */}
        {goal.sources && goal.sources.length > 0 && (
          <Box
            sx={{
              mt: 1.25,
              p: 1,
              bgcolor: COLORS.bg,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: COLORS.textMuted, fontWeight: 600, display: 'block', mb: 0.5 }}
            >
              FUNDING SOURCES
            </Typography>
            {goal.sources.map((s, i) => (
              <Typography key={i} sx={{ fontSize: 11, color: COLORS.text, py: 0.25 }}>
                &bull; {s}
              </Typography>
            ))}
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1.25 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onUpdateSaved(goal.id, 1000)}
            sx={{ flex: 1, fontSize: 12, py: 0.5, borderColor: COLORS.border, color: COLORS.text }}
          >
            + &#8377;1K
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onUpdateSaved(goal.id, -1000)}
            sx={{ flex: 1, fontSize: 12, py: 0.5, borderColor: COLORS.border, color: COLORS.text }}
          >
            - &#8377;1K
          </Button>
          <IconButton
            size="small"
            onClick={() => onEdit(goal)}
            sx={{ color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, borderRadius: 3 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setShowDeleteConfirm(true)}
            sx={{ color: COLORS.red, border: `1px solid ${COLORS.redDim}`, borderRadius: 3 }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Delete confirmation */}
        <Collapse in={showDeleteConfirm}>
          <Box
            sx={{
              mt: 1,
              p: 1.25,
              bgcolor: COLORS.redBg,
              border: `1px solid ${COLORS.red}30`,
              borderRadius: 2.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: COLORS.red, fontWeight: 500 }}>
              Delete &ldquo;{goal.name}&rdquo;?
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Button size="small" onClick={() => setShowDeleteConfirm(false)} sx={{ fontSize: 12 }}>
                Cancel
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => { onDelete(goal.id); setShowDeleteConfirm(false); }}
                sx={{ fontSize: 12 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
