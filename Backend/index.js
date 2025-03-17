const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.on("connection", (socket) => {

    /**
     *   Emits the socket ID to the connected client
     * - When a user connects, they receive their unique socket ID.
     */
    socket.emit("me", socket.id);

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

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
