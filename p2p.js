// p2p.js

// eslint-disable-next-line no-undef
const socket = io("http://localhost:3000");

function socketfunc() {
  socket.emit("offer", "bi offer");
  socket.on("offer", (response) => {
    console.log(response);
  });
}
