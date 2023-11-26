const socket = io("http://localhost:3000");

socket.on("user-list", (users) => {
  const userList = document.getElementById("user-list");
  // Clear the existing user list
  userList.innerHTML = "";
  // Update the user list

  // for(const [key, value] of Object.entries(users)) {
  //     addUserToList(value, key);
  //     // console.log(value)
  // }
  for (let i = 0; i < users.length; i++) {
    console.log(users[i]);
          addUserToList(users[i], "key");

  }
  // console.log(users);
});

socket.on("user-connected", ({ userName, userId }) => {
  addUserToList(userName, userId);
  appendMessage(`${userName} connected`);
});

socket.on("user-disconnected", ({ userName, userId }) => {
  removeUserFromList(userId);
  appendMessage(`${userName} disconnected`);
});

socket.on("offer", ({ offer, userName, userId }) => {
  // Handle incoming offer
  appendMessage(`${userName} sent an offer: ${offer}`);
});

socket.on("answer", ({ answer, userName, userId }) => {
  // Handle incoming answer
  appendMessage(`${userName} sent an answer: ${answer}`);
});

socket.on("ice-candidate", ({ candidate, userName, userId }) => {
  // Handle incoming ice candidate
  appendMessage(`${userName} sent an ice candidate: ${candidate}`);
});

socket.on("message", ({ userName, message }) => {
  appendMessage(`${userName}: ${message}`);
});

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  messageInput.value = "";

  appendMessage(`You: ${message}`);
  socket.emit("message", message);
}

function appendMessage(message) {
  const messagesList = document.getElementById("messages");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(message));
  messagesList.appendChild(li);
}

function addUserToList(userName, userId) {
  const userList = document.getElementById("user-list");
  const li = document.createElement("li");
  li.setAttribute("id", userId);
  li.appendChild(document.createTextNode(userName));
  userList.appendChild(li);
}

function removeUserFromList(userId) {
  const userElement = document.getElementById(userId);
  if (userElement) {
    userElement.remove();
  }
}
