import React from 'react';
import { AppBar, Typography, Toolbar, Box } from '@mui/material';
import VideoPlayer from './Components/VideoPlayer';
import Options from './Components/Options';
import Notifications from './Components/Notifications';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={4}
        sx={{
          borderRadius: '12px',
          mt: 4,
          mb: 3,
          px: 4,
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'fit-content',
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: 'black',
            }}
          >
            Welcome to the ConnectCam
          </Typography>
        </Toolbar>
      </AppBar>

      <VideoPlayer />

      <Options>
        <Notifications />
      </Options>
    </Box>
  );
};

export default App;
