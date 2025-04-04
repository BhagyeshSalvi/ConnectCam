import React from 'react';
import { Box } from '@mui/material';
import VideoPlayer from './Components/VideoPlayer';
import Options from './Components/Options';
import Notifications from './Components/Notifications';
import { motion } from 'framer-motion';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* 🔷 Logo on top-left corner */}
      <Box
        sx={{
          position: 'absolute',
          top: 5,
          left: 20,
          zIndex: 10,
        }}
      >
        <img
          src="/Logo.png"
          alt="ConnectCam Logo"
          style={{
            width: '200px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
      <Options />

      {/* 🎥 Video Player with zoom-in animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <VideoPlayer />
      </motion.div>

      {/* 📞 Options and Notification */}
      
      <Notifications />
    </Box>
  );
};

export default App;
