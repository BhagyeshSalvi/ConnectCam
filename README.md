# ConnectCam 🎥

ConnectCam is a modern, real-time video calling web app powered by WebRTC, Socket.IO, and AI features like live transcription and translation.

🔗 **Live Demo**: [connect-cam-dun.vercel.app/login](https://connect-cam-dun.vercel.app/login)

---

## 🚀 Features

- ✅ Real-time video/audio calling using WebRTC
- ✅ Live speech-to-text transcription via **AssemblyAI**
- ✅ Real-time multilingual translation via **MyMemory Translation API**
- ✅ Beautiful UI with **glassmorphism design** and **Framer Motion** animations
- ✅ Scalable backend with **Node.js**, **Express**, and **MongoDB**
- ✅ Socket-based signaling system using **Socket.IO**

---

## 🛠️ Tech Stack

**Frontend**
- React
- MUI (Material UI)
- Framer Motion
- Simple-Peer (WebRTC wrapper)

**Backend**
- Node.js
- Express.js
- Socket.IO
- MongoDB

**APIs Used**
- AssemblyAI (Speech-to-Text)
- MyMemory (Translation API)

---

## 🧠 How It Works

1. Users join the platform and access their camera/microphone.
2. A peer connection is established using WebRTC via Socket.IO signaling.
3. Audio is transcribed in real-time using AssemblyAI.
4. Transcripts are translated using MyMemory API.
5. Captions are shown live during the call.

---

## 🧪 Run Locally

### 📦 Backend Setup
```bash
cd backend
npm install
node index.js
```

### 💻 Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🤝 Contribute or Collaborate

Got ideas to improve ConnectCam? Want to help implement new features like screen sharing, background blur, or group calls?

Feel free to fork the repo, raise an issue, or connect with me directly!

---

## 📄 License

MIT License – free to use, modify, and share.
