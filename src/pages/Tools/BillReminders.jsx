import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Switch, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useReminders } from '../../hooks/useReminders';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';
import ReminderForm from './ReminderForm';

export default function BillReminders() {
  const { reminders, addReminder, updateReminder, toggleReminder, deleteReminder } = useReminders();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editReminderData, setEditReminderData] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const today = new Date().getDate();

  const overdue = reminders
    .filter((r) => r.active && parseInt(r.dueDate) < today)
    .sort((a, b) => parseInt(a.dueDate) - parseInt(b.dueDate));

  const upcoming = reminders
    .filter((r) => r.active && parseInt(r.dueDate) >= today)
    .sort((a, b) => parseInt(a.dueDate) - parseInt(b.dueDate));

  const handleAdd = async (formData) => {
    await addReminder(formData);
    setShowAdd(false);
  };

  const openEdit = (reminder) => {
    setEditReminderData(reminder);
    setShowEdit(true);
  };

  const handleEditSave = async (formData) => {
    if (editReminderData?.id) {
      await updateReminder(editReminderData.id, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
      });
    }
    setShowEdit(false);
    setEditReminderData(null);
  };

  const handleEditDelete = async (id) => {
    await deleteReminder(id);
    setShowEdit(false);
    setEditReminderData(null);
  };

  const handleDeleteConfirm = async (id) => {
    await deleteReminder(id);
    setDeleteConfirmId(null);
  };

  const getDueSuffix = (day) => {
    const d = parseInt(day);
    if (d === 1 || d === 21) return 'st';
    if (d === 2 || d === 22) return 'nd';
    if (d === 3 || d === 23) return 'rd';
    return 'th';
  };

  const ReminderCard = ({ reminder, isOverdue = false }) => (
    <Card
      sx={{
        mb: 0.75,
        opacity: reminder.active ? 1 : 0.5,
        borderColor: isOverdue ? `${COLORS.red}30` : COLORS.border,
      }}
    >
      <CardContent sx={{ p: '10px 12px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: COLORS.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {reminder.name}
              </Typography>
              {reminder.category && (
                <Typography
                  sx={{
                    fontSize: 9,
                    color: COLORS.textMuted,
                    bgcolor: `${COLORS.border}80`,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.75,
                    flexShrink: 0,
                  }}
                >
                  {reminder.category}
                </Typography>
              )}
            </Box>
            <Typography sx={{ fontSize: 10, color: isOverdue ? COLORS.red : COLORS.textMuted }}>
              Due: {reminder.dueDate}{getDueSuffix(reminder.dueDate)} of every month
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: isOverdue ? COLORS.red : COLORS.text,
              }}
            >
              {fmtFull(reminder.amount)}
            </Typography>
            <IconButton size="small" onClick={() => openEdit(reminder)} sx={{ color: COLORS.textMuted }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteConfirmId(reminder.id)}
              sx={{ color: COLORS.textDim }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Inline delete confirmation */}
        {deleteConfirmId === reminder.id && (
          <Box
            sx={{
              bgcolor: COLORS.redBg,
              border: `1px solid ${COLORS.red}30`,
              borderRadius: 2,
              p: '8px 12px',
              mt: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 11, color: COLORS.red, fontWeight: 500 }}>
              Delete &ldquo;{reminder.name}&rdquo;?
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <Button
                size="small"
                onClick={() => setDeleteConfirmId(null)}
                sx={{ fontSize: 11, minWidth: 'auto', px: 1 }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDeleteConfirm(reminder.id)}
                sx={{ fontSize: 11, minWidth: 'auto', px: 1 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAdd(true)}
          sx={{ px: 2 }}
        >
          Add
        </Button>
      </Box>

      {/* Empty State */}
      {reminders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <NotificationsNoneIcon sx={{ fontSize: 48, color: COLORS.textDim, mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            No reminders yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add recurring bills to never miss a payment
          </Typography>
        </Box>
      ) : (
        <>
          {/* Overdue Section */}
          {overdue.length > 0 && (
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: COLORS.red,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  display: 'block',
                  mb: 0.75,
                }}
              >
                Overdue
              </Typography>
              {overdue.map((r) => (
                <ReminderCard key={r.id} reminder={r} isOverdue />
              ))}
            </Box>
          )}

          {/* Upcoming Section */}
          {upcoming.length > 0 && (
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: COLORS.green,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  display: 'block',
                  mb: 0.75,
                }}
              >
                Upcoming
              </Typography>
              {upcoming.map((r) => (
                <ReminderCard key={r.id} reminder={r} />
              ))}
            </Box>
          )}

          {/* All Bills Section */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: COLORS.textMuted,
                fontWeight: 600,
                letterSpacing: 0.5,
                display: 'block',
                mb: 0.75,
              }}
            >
              All Bills ({reminders.length})
            </Typography>
            {reminders.map((r) => (
              <Card
                key={r.id}
                sx={{
                  mb: 0.75,
                  opacity: r.active ? 1 : 0.5,
                }}
              >
                <CardContent sx={{ p: '10px 12px !important' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                      <Switch
                        checked={r.active}
                        onChange={() => toggleReminder(r.id)}
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: COLORS.accent,
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            bgcolor: COLORS.accent,
                          },
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: COLORS.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {r.name}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                          Every {r.dueDate}{getDueSuffix(r.dueDate)} &middot; {r.category}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
                        {fmtFull(r.amount)}
                      </Typography>
                      <IconButton size="small" onClick={() => openEdit(r)} sx={{ color: COLORS.textMuted }}>
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirmId(r.id)}
                        sx={{ color: COLORS.textDim }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Inline delete confirmation */}
                  {deleteConfirmId === r.id && (
                    <Box
                      sx={{
                        bgcolor: COLORS.redBg,
                        border: `1px solid ${COLORS.red}30`,
                        borderRadius: 2,
                        p: '8px 12px',
                        mt: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: 11, color: COLORS.red, fontWeight: 500 }}>
                        Delete &ldquo;{r.name}&rdquo;?
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Button
                          size="small"
                          onClick={() => setDeleteConfirmId(null)}
                          sx={{ fontSize: 11, minWidth: 'auto', px: 1 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteConfirm(r.id)}
                          sx={{ fontSize: 11, minWidth: 'auto', px: 1 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}

      {/* Add Reminder Dialog */}
      <ReminderForm
        open={showAdd}
        onClose={() => setShowAdd(false)}
        reminder={null}
        onSave={handleAdd}
      />

      {/* Edit Reminder Dialog */}
      <ReminderForm
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditReminderData(null); }}
        reminder={editReminderData}
        onSave={handleEditSave}
        onDelete={handleEditDelete}
      />
    </Box>
  );
}
