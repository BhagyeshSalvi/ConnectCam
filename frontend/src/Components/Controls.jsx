import React, { useState } from 'react';
import { Button, Box, Paper } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';

const Controls = ({ stream }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const toggleMic = () => {
    const newState = !isMicOn;
    setIsMicOn(newState);
    if (stream && stream.getAudioTracks().length > 0) {
      stream.getAudioTracks()[0].enabled = newState;
    }
  };

  const toggleCam = () => {
    const newState = !isCamOn;
    setIsCamOn(newState);
    if (stream && stream.getVideoTracks().length > 0) {
      stream.getVideoTracks()[0].enabled = newState;
    }
  };

  if (!stream) {
    return (
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button disabled variant="outlined">Loading Controls...</Button>
      </Box>
    );
  }

  const iconButtonStyle = {
    minWidth: '50px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <Paper
      elevation={6}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        mt: 4,
        mb: 4,
        px: 4,
        py: 2,
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      <Button
        variant="contained"
        color={isMicOn ? 'warning' : 'success'}
        onClick={toggleMic}
        sx={iconButtonStyle}
      >
        {isMicOn ? <Mic /> : <MicOff />}
      </Button>

      <Button
        variant="contained"
        color={isCamOn ? 'warning' : 'success'}
        onClick={toggleCam}
        sx={iconButtonStyle}
      >
        {isCamOn ? <Videocam /> : <VideocamOff />}
      </Button>
    </Paper>
  );
};

export default Controls;