

// const express = require("express");
// const http = require("http");
// const socketIO = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: {
//     origin: "http://127.0.0.1:5500",
//     methods: ["GET", "POST"],
//   },
// });

// const users = {}; // Object to store connected users
// let userCount = 0; // Counter for generating unique usernames

// io.on("connection", (socket) => {
//   const userId = socket.id; // Use socket ID as a unique identifier
//   const userName = generateUniqueUserName(); // Assign a unique and meaningful name

//   users[userId] = userName; // Store the user in the users object
//   userCount++;

//   console.log(`${userName} connected`);

//   // Emit the updated user list and user count to all connected clients
//   io.emit("user-list", Object.values(users));
//   io.emit("user-count", userCount);

//   // Broadcast the new user's name and ID to all connected users except the newly connected client
//   socket.broadcast.emit("user-connected", { userName, userId });

//   socket.on("offer", (data) => {
//     // Broadcast the offer to all connected users
//     io.emit("offer", { ...data, sender: userId });
//   });

//   socket.on("answer", (data) => {
//     // Broadcast the answer to all connected users
//     io.emit("answer", { ...data, sender: userId });
//   });

//   socket.on("ice-candidate", (data) => {
//     // Broadcast the ice candidate to all connected users
//     io.emit("ice-candidate", { ...data, sender: userId });
//   });

//   // Handle incoming messages
//   socket.on("message", (message) => {
//     // Broadcast the message to all connected users
//     io.emit("message", { message, userName, userId });
//   });

//   socket.on("disconnect", () => {
//     console.log(`${userName} disconnected`);
//     // Remove the user from the users object
//     delete users[userId];
//     // Broadcast the updated user list and user count to all connected clients
//     io.emit("user-list", Object.values(users));
//     io.emit("user-count", userCount);
//     // Broadcast the disconnected user's name and id to all connected users
//     io.emit("user-disconnected", { userName, userId });
//   });
// });

// function generateUniqueUserName() {
//   userCount++;
//   return `User${userCount}`;
// }

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
