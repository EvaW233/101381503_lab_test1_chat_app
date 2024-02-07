//script.js

const socket = io();


function sendMessage(message) {
  
  socket.emit('chatMessage', message);
}


socket.on('message', (message) => {
  
  appendMessage(message);
});


function appendMessage(message) {
  const chatMessages = document.getElementById('chat-messages');
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  chatMessages.appendChild(messageElement);
}


document.getElementById('send-button').addEventListener('click', () => {
 
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value;
  
  sendMessage(message);
  
  messageInput.value = '';
});


document.getElementById('leave-room-button').addEventListener('click', () => {
  
  socket.emit('leaveRoom');
});
