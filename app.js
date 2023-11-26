// Install required packages
// npm install express socket.io

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});
const usernames = [];

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/peer.html');
});

// Handle socket connections
io.on('connection', (socket) => {
  // Generate a random username and assign it to the socket
  const username = generateRandomUsername();
  socket.username = username;

  // Add the new user to the array of usernames
  usernames.push(username);

  // Broadcast to all clients when a new user connects
  io.emit('updateUsers', usernames);

  // Log when a user connects
  console.log(`${username} connected`);

  // Listen for disconnect event
  socket.on('disconnect', () => {
    // Remove the user from the array of usernames
    const index = usernames.indexOf(username);
    if (index !== -1) {
      usernames.splice(index, 1);
    }

    // Broadcast to all clients when a user disconnects
    io.emit('updateUsers', usernames);

    // Log when a user disconnects
    console.log(`${username} disconnected`);
  });

  // Listen for chat messages from clients
  socket.on('chatMessage', (data) => {
    // Broadcast the message to all clients
    io.emit('chatMessage', { username, message: data.message });
  });
});

// Helper function to generate a random username
function generateRandomUsername() {
  const adjectives = ['Red', 'Blue', 'Green', 'Happy', 'Sad', 'Lucky'];
  const nouns = ['Cat', 'Dog', 'Fish', 'Sun', 'Moon', 'Star'];

  let username;
  do {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    username = `${adjective}-${noun}`;
  } while (usernames.includes(username));

  return username;
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
