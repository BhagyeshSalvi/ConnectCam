require("dotenv").config(); // Load .env
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const authRoutes = require('./routes/auth')
const connectDB = require("./db");
connectDB(); // Connect to MongoDB


const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

app.use(express.json()); // Required to parse JSON body
app.use("/api", authRoutes); // Use routes with /api prefix

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {

    console.log("Client connected:", socket.id);

    /**
     *   Emits the socket ID to the connected client
     * - When a user connects, they receive their unique socket ID.
     */
    setTimeout(() => {
        socket.emit("me", socket.id);
        console.log("📤 Emitted 'me' with ID after delay:", socket.id);
    }, 100); // 100ms delay


    /**
     *   Handles user disconnection
     * - When a user disconnects, this event notifies all other connected clients
     *   that the call has ended.
     */
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    /**
     *    Handles calling another user
     * - `userToCall` → ID of the user being called
     * - `signalData` → WebRTC signaling data from the caller
     * - `from` → The caller's socket ID
     * - `callerName` → Name of the caller (for UI purposes)
     *
     * - Sends the `"callUser"` event to the `userToCall`
     *   so they receive the call request.
     */
    socket.on("callUser", ({ userToCall, signalData, from, callerName }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, callerName });
    });

    /**
     *   Handles answering a call
     * - `data.to` → The caller's socket ID (who initiated the call)
     * - `data.signal` → WebRTC answer signal from the callee
     *
     * - Sends the `"callAccepted"` event back to the caller,
     *   allowing the WebRTC connection to be established.
     */
    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("audio-chunk", async (arrayBuffer) => {
        try {
          // 1. Save chunk as temporary .webm file
          const tempFileName = `temp-${Date.now()}.webm`;
          const tempFilePath = path.join(__dirname, tempFileName);
          await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));
      
          // 2. Upload file to AssemblyAI
          const uploadRes = await axios({
            method: 'post',
            url: 'https://api.assemblyai.com/v2/upload',
            headers: { authorization: process.env.ASSEMBLY_API_KEY },
            data: fs.createReadStream(tempFilePath),
          });
      
          const uploadUrl = uploadRes.data.upload_url;
      
          // 3. Request transcription
          const transcriptRes = await axios.post('https://api.assemblyai.com/v2/transcript', {
            audio_url: uploadUrl
          }, {
            headers: { authorization: process.env.ASSEMBLY_API_KEY }
          });
      
          const transcriptId = transcriptRes.data.id;
      
          // 4. Poll for completion
          let completed = false;
          let transcriptText = "[transcribing...]";
          while (!completed) {
            const pollingRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
              headers: { authorization: process.env.ASSEMBLY_API_KEY }
            });
      
            if (pollingRes.data.status === "completed") {
              transcriptText = pollingRes.data.text;
              completed = true;
            } else if (pollingRes.data.status === "error") {
              transcriptText = "[Error transcribing audio]";
              completed = true;
            } else {
              await new Promise(res => setTimeout(res, 1000)); // wait 1 second before polling again
            }
          }
      
          // 5. Emit caption back to frontend
          socket.emit("caption", transcriptText);
      
          // 6. Delete temp file
          await fs.remove(tempFilePath);
      
        } catch (err) {
          console.error("❌ STT error:", err.message);
          socket.emit("caption", "[STT failed]");
        }
      });
      

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
