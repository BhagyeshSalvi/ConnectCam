require("dotenv").config(); // Load .env
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const authRoutes = require('./routes/auth');
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

    setTimeout(() => {
        socket.emit("me", socket.id);
        console.log("📤 Emitted 'me' with ID after delay:", socket.id);
    }, 100);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, callerName }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, callerName });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
    });

    socket.on("audio-chunk", async ({ buffer, sourceLang = "en" }) => {
        try {
            const tempFileName = `temp-${Date.now()}.webm`;
            const tempFilePath = path.join(__dirname, tempFileName);
            await fs.writeFile(tempFilePath, Buffer.from(buffer));

            // Upload to AssemblyAI
            const uploadRes = await axios({
                method: 'post',
                url: 'https://api.assemblyai.com/v2/upload',
                headers: { authorization: process.env.ASSEMBLY_API_KEY },
                data: fs.createReadStream(tempFilePath),
            });

            const uploadUrl = uploadRes.data.upload_url;

            // Request transcription
            const transcriptRes = await axios.post('https://api.assemblyai.com/v2/transcript', {
                audio_url: uploadUrl,
                language_code: sourceLang,
            }, {
                headers: { authorization: process.env.ASSEMBLY_API_KEY }
            });

            const transcriptId = transcriptRes.data.id;
            let completed = false;
            let transcriptText = "";

            while (!completed) {
                const pollingRes = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                    headers: { authorization: process.env.ASSEMBLY_API_KEY }
                });

                if (pollingRes.data.status === "completed") {
                    transcriptText = pollingRes.data.text;
                    completed = true;
                } else if (pollingRes.data.status === "error") {
                    transcriptText = "";
                    completed = true;
                } else {
                    await new Promise(res => setTimeout(res, 1000));
                }
            }

            if (!transcriptText || transcriptText.trim() === "") {
                await fs.remove(tempFilePath);
                return;
            }

            // Translate using MyMemory
            let translatedText = transcriptText;
            try {
                const translationRes = await axios.get('https://api.mymemory.translated.net/get', {
                    params: {
                        q: transcriptText,
                        langpair: `${sourceLang}|en`,
                        de: process.env.MYMEMORY_EMAIL, // Registered email for quota boost
                    }
                });

                translatedText = translationRes.data.responseData.translatedText;
                console.log("🌐 Translation:", translatedText);

            } catch (transErr) {
                console.error("❌ Translation error:", transErr.message);
                translatedText = `[Translation failed] ${transcriptText}`;
            }

            io.emit("caption", translatedText);

            await fs.remove(tempFilePath);

        } catch (err) {
            console.error("❌ STT+Translation error:", err.message);
            // Don't emit anything to suppress "[STT failed]"
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
