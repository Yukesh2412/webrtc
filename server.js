const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

let userCount = 0; // Initialize user count

io.on("connection", (socket) => {
  userCount++;
  const userName = `User ${userCount}`; // Assign a dynamic name

  console.log(`${userName} connected`);

  // Broadcast the new user's name to all connected users
  io.emit("user-connected", { userName, userId: userCount });

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", { offer, userName });
    console.log(offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", { answer, userName });
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", { candidate, userName });
  });

  socket.on("disconnect", () => {
    console.log(`${userName} disconnected`);
    // Broadcast the disconnected user's name and id to all connected users
    io.emit("user-disconnected", { userName, userId: userCount });
    if(userCount > 0) {
      userCount--;
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
