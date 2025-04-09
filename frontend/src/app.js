import React ,{useEffect,useContext}from 'react';
import { Box, Button } from '@mui/material';
import VideoPlayer from './Components/VideoPlayer';
import Options from './Components/Options';
import Notifications from './Components/Notifications';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../src/SocketContext';

const App = () => {
  const navigate = useNavigate();
  const {myVideo,setStream}= useContext(SocketContext);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Media permission denied:", err);
      });
  }, [setStream,myVideo]);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

      {/* 🔴 Logout Button on top-right */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 20,
          zIndex: 10,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
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

      <Notifications />
    </Box>
  );
};

export default App;
