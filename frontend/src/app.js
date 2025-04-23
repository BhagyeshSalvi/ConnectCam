import React, { useEffect, useContext, useState } from 'react';
import { Box, Button } from '@mui/material';
import VideoPlayer from './Components/VideoPlayer';
import Options from './Components/Options';
import Notifications from './Components/Notifications';
import Controls from './Components/Controls';
import useAudioCapture from './hooks/useAudioCapture';
import { motion } from 'framer-motion';
import { SocketContext } from './SocketContext';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const { myVideo, setStream, stream, socket } = useContext(SocketContext);
  const [caption, setCaption] = useState('');

  useAudioCapture(stream);

  // ✅ Start media stream
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

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [myVideo, setStream]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    navigate('/login');
  };

  // ✅ Caption handler
  useEffect(() => {
    if (!socket) return;

    socket.on('caption', (text) => {
      console.log('💬 Caption received:', text);
      setCaption(text);

      setTimeout(() => setCaption(''), 5000); // Auto-hide after 5s
    });

    return () => {
      socket.off('caption');
    };
  }, [socket]);

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
      {/* 🔷 Logo */}
      <Box sx={{ position: 'absolute', top: 5, left: 20, zIndex: 10 }}>
        <img src="/Logo.png" alt="ConnectCam Logo" style={{ width: '200px', objectFit: 'contain' }} />
      </Box>

      {/* 🔴 Logout */}
      <Box sx={{ position: 'absolute', top: 10, right: 20, zIndex: 10 }}>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
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

      {/* 💬 Caption Overlay */}
      {caption && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.75)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '12px',
          fontSize: '1.2rem',
          zIndex: 20,
          maxWidth: '90%',
          textAlign: 'center',
        }}>
          {caption}
        </div>
      )}

      <Notifications />
      <Controls stream={stream} />
    </Box>
  );
};

export default App;
