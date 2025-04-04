import React, { useContext } from 'react';
import { Grid2, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '../SocketContext';

// Styled components using MUI's styled API
const StyledVideo = styled('video')(({ theme }) => ({
  width: '550px',
  [theme.breakpoints.down('sm')]: {
    width: '300px', 
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '10px',
  border: '2px solid black',
  margin: '10px',
}));

const StyledGrid = styled(Grid2)(({ theme }) => ({
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  return (
    <StyledGrid container>
      {stream && (
        <StyledPaper>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            <StyledVideo playsInline muted ref={myVideo} autoPlay />
          </Grid2>
        </StyledPaper>
      )}
      {callAccepted && !callEnded && (
        <StyledPaper>
          <Grid2 item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            <StyledVideo playsInline ref={userVideo} autoPlay />
          </Grid2>
        </StyledPaper>
      )}
    </StyledGrid>
  );
};

export default VideoPlayer;
