const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const path = require('path'); 

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


const mongoURI = 'mongodb+srv://evaw0929:Ilovecats1314@cluster0.pt8pr8x.mongodb.net/chat_app?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


io.on('connection', (socket) => {
  console.log('New WebSocket connection');

  socket.on('join', ({ username, room }) => {
    socket.join(room);
    socket.broadcast.to(room).emit('message', `${username} has joined the chat`);
  });

  
  socket.on('chatMessage', ({ username, room, message }) => {
    io.to(room).emit('message', `${username}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('User left');
  });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
