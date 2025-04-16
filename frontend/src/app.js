import React, { useEffect, useContext } from 'react';
import { Box, Button } from '@mui/material';
import VideoPlayer from './Components/VideoPlayer';
import Options from './Components/Options';
import Notifications from './Components/Notifications';
import Controls from './Components/Controls';
import { motion } from 'framer-motion';
import { SocketContext } from './SocketContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const { myVideo, setStream, stream } = useContext(SocketContext);

  // ✅ Start media stream on mount, and stop on unmount
  useEffect(() => {
    let activeStream;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        activeStream = currentStream;
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Media permission denied:", err);
      });

    // ✅ Cleanup: stop all tracks when component unmounts
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [myVideo, setStream]);

  const handleLogout = () => {
    // ❌ Clear login data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 🔇 Stop camera/mic stream if running
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // 🔁 Navigate to login
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* 🔷 Logo top-left */}
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
          style={{ width: '200px', objectFit: 'contain' }}
        />
      </Box>

      {/* 🔴 Logout Button top-right */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 20,
          zIndex: 10,
        }}
      >
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Options />

      {/* 🎥 Video Player */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <VideoPlayer />
      </motion.div>

      <Notifications />
      <Controls stream={stream}/>
    </Box>
  );
};

export default App;
