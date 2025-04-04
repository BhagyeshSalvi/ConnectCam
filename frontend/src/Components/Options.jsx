import React, { useState, useContext } from 'react';
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '../SocketContext';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  width: '600px',
  marginTop: '35px',
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    width: '80%',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '10px 20px',
  border: '2px solid black',
}));

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const PaddedGridItem = styled(Grid)({
  padding: 20,
});

const MarginTopButton = styled(Button)({
  marginTop: 20,
});

const Options = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, endCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <StyledContainer>
      <StyledPaper elevation={10}>
        <StyledForm noValidate autoComplete="off">
          <StyledGridContainer container spacing={2}>
            {/* Account Info */}
            <PaddedGridItem item xs={12} md={6}>
              <Typography gutterBottom variant="h6">
                Account Info
              </Typography>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              {console.log("id is: ", me)}
              <CopyToClipboard text={me}>
                <MarginTopButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </MarginTopButton>
              </CopyToClipboard>
            </PaddedGridItem>

            {/* Make a Call */}
            <PaddedGridItem item xs={12} md={6}>
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>
              <TextField
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {callAccepted && !callEnded ? (
                <MarginTopButton
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={endCall}
                >
                  Hang Up
                </MarginTopButton>
              ) : (
                <MarginTopButton
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </MarginTopButton>
              )}
            </PaddedGridItem>
          </StyledGridContainer>
        </StyledForm>
        {children}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Options;
