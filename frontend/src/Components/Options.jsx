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
  background: 'rgba(255, 255, 255, 0.05)', // semi-transparent
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'white',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
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

const StyledButton = styled(Button)({
  marginTop: 20,
  fontWeight: 'bold',
  borderRadius: 10,
});

const StyledTextField = styled(TextField)({
  input: {
    color: 'white',
  },
  label: {
    color: 'rgba(255,255,255,0.7)',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00bcd4',
    },
  },
});

const Options = () => {
  const { me, callAccepted, name, setName, callEnded, endCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <StyledContainer>
      <StyledPaper elevation={6}>
        <StyledForm noValidate autoComplete="off">
          <StyledGridContainer container spacing={2}>
            {/* Account Info */}
            <PaddedGridItem item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Account Info
              </Typography>
              <StyledTextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <CopyToClipboard text={me}>
                <StyledButton
                  variant="contained"
                  color="info"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </StyledButton>
              </CopyToClipboard>
            </PaddedGridItem>

            {/* Make a Call */}
            <PaddedGridItem item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Make a call
              </Typography>
              <StyledTextField
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {callAccepted && !callEnded ? (
                <StyledButton
                  variant="contained"
                  color="error"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={endCall}
                >
                  Hang Up
                </StyledButton>
              ) : (
                <StyledButton
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </StyledButton>
              )}
            </PaddedGridItem>
          </StyledGridContainer>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Options;
