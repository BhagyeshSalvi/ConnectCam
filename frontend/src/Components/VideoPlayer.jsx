import React, { useContext } from 'react';
import { Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

import { SocketContext } from '../SocketContext';

// Styled video element
const StyledVideo = styled('video')(({ theme }) => ({
  width: '550px',
  borderRadius: '12px',
  [theme.breakpoints.down('sm')]: {
    width: '300px',
  },
}));

// Glassmorphic paper
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  padding: '20px',
  margin: '15px',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0px 4px 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {stream && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <StyledPaper elevation={6}>
            <Typography variant="h5" gutterBottom>
              {name || 'Your Video'}
            </Typography>
            <StyledVideo playsInline muted ref={myVideo} autoPlay />
          </StyledPaper>
        </motion.div>
      )}

      {callAccepted && !callEnded && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <StyledPaper elevation={6}>
            <Typography variant="h5" gutterBottom>
              {call.name || 'Caller'}
            </Typography>
            <StyledVideo playsInline ref={userVideo} autoPlay />
          </StyledPaper>
        </motion.div>
      )}
    </div>
  );
};

export default VideoPlayer;
