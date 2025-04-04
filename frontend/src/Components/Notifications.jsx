import React, { useContext } from 'react';
import { Paper, Typography, Button, Slide } from '@mui/material';
import { Phone } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { SocketContext } from '../SocketContext';

const NotificationCard = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  right: 20,
  zIndex: 2000,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  border: '2px solid #008080',
}));

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  if (!call.isReceivedCall || callAccepted) return null;

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <NotificationCard elevation={6}>
        <Typography variant="body1">
          {call.name || 'Someone'} is calling...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Phone />}
          onClick={answerCall}
        >
          Answer
        </Button>
      </NotificationCard>
    </Slide>
  );
};

export default Notifications;
