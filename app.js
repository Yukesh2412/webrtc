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
const sdpOffers = {}; // Store SDP offers on the server
const sdpAnswers = {}; // Store SDP answers on the server

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/peer.html');
});

io.on('connection', (socket) => {
  const username = generateRandomUsername();
  socket.username = username;
  usernames.push(username);

  // Share the new peer's SDP offer with the server
  socket.on('shareSdpOffer', (offer) => {
    sdpOffers[socket.id] = offer;

    // Provide the new peer with the SDP offers of existing peers
    io.emit('allSdpOffers', getAllSdpOffers(socket.id));
  });

  // Handle SDP answer from the client
  socket.on('shareSdpAnswer', (answer) => {
    sdpAnswers[socket.id] = answer;

    io.emit('allSdpAnswers', getAllSdpAnswers(socket.id));
  });

  io.emit('updateUsers', usernames);
  console.log(`${username} connected`);

  socket.on('disconnect', () => {
    const index = usernames.indexOf(username);
    if (index !== -1) {
      usernames.splice(index, 1);
    }

    // Remove the SDP offer and answer of the disconnected peer
    delete sdpOffers[socket.id];
    delete sdpAnswers[socket.id];

    io.emit('updateUsers', usernames);
    console.log(`${username} disconnected`);
  });

  socket.on('chatMessage', (data) => {
    io.emit('chatMessage', { username, message: data.message });
  });
});

function getAllSdpOffers(excludedSocketId) {
  return Object.keys(sdpOffers)
    .filter((socketId) => socketId !== excludedSocketId)
    .map((socketId) => ({
      socketId,
      offer: sdpOffers[socketId],
    }));
}
function getAllSdpAnswers(excludedSocketId) {
  return Object.keys(sdpAnswers)
    .filter((socketId) => socketId !== excludedSocketId)
    .map((socketId) => ({
      socketId,
      answer: sdpOffers[socketId],
    }));
}

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
