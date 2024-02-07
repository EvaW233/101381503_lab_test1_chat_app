const express = require('express');
const router = express.Router();
const { io } = require('../server'); 

let users = [];
let chatRooms = [
  { name: 'devops', members: [] },
  { name: 'cloud computing', members: [] },
  { name: 'covid19', members: [] },
  { name: 'sports', members: [] },
  { name: 'nodeJS', members: [] }
];

router.post('/join', (req, res) => {
  const { username, room } = req.body;
  
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const selectedRoom = chatRooms.find(chatRoom => chatRoom.name === room);
  if (!selectedRoom) {
    return res.status(404).json({ error: 'Room not found' });
  }

  selectedRoom.members.push(username);
  users.push({ username, room });

  res.status(200).json({ message: 'User joined room successfully' });
});

router.post('/leave', (req, res) => {
  const { username, room } = req.body;

  const selectedRoom = chatRooms.find(chatRoom => chatRoom.name === room);
  if (!selectedRoom) {
    return res.status(404).json({ error: 'Room not found' });
  }

  selectedRoom.members = selectedRoom.members.filter(member => member !== username);
  users = users.filter(user => !(user.username === username && user.room === room));

  res.status(200).json({ message: 'User left room successfully' });
});

router.post('/send-message', (req, res) => {
  const { username, room, message } = req.body;

  io.to(room).emit('message', { username, message });

  res.status(200).json({ message: 'Message sent successfully' });
});


router.post('/typing', (req, res) => {
  const { username, room, isTyping } = req.body;

  io.to(room).emit('typing', { username, isTyping });

  res.status(200).json({ message: 'Typing status updated successfully' });
});

module.exports = router;
