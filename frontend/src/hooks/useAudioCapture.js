import { useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../SocketContext';

const useAudioCapture = (stream, sourceLang = 'es') => {
  const { socket } = useContext(SocketContext);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const speakingRef = useRef(false);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!stream || !stream.getAudioTracks().length) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const startRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') return;

      const audioStream = new MediaStream(stream.getAudioTracks());
      const mediaRecorder = new MediaRecorder(audioStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          socket.emit("audio-chunk", { buffer: arrayBuffer, sourceLang });
        }
      };

      mediaRecorder.start(2000);
      console.log("🎙️ Started recording");
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
        console.log("🔇 Stopped recording");
      }
    };

    const detectSpeech = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      const speakingThreshold = 15;

      if (avg > speakingThreshold) {
        if (!speakingRef.current) {
          speakingRef.current = true;
          startRecording();
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
        }
      } else {
        if (speakingRef.current) {
          if (!silenceTimeoutRef.current) {
            silenceTimeoutRef.current = setTimeout(() => {
              speakingRef.current = false;
              stopRecording();
              silenceTimeoutRef.current = null;
            }, 1500);
          }
        }
      }

      requestAnimationFrame(detectSpeech);
    };

    detectSpeech();

    return () => {
      stopRecording();
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [stream, socket, sourceLang]);
};

export default useAudioCapture;
