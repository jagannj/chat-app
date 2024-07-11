const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/group');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// middleware
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));


// routes


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
});

const db = mongoose.connection;

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinRoom', ({ userId, groupId }) => {
    socket.join(groupId);
    console.log(`${userId} joined group ${groupId}`);
  });

  socket.on('joinPrivateChat', ({ userId, receiverId }) => {
    const room = [userId, receiverId].sort().join('-');
    socket.join(room);
    console.log(`${userId} joined private chat with ${receiverId}`);
  });

  socket.on('sendMessage', ({ groupId, receiverId, message }) => {
    console.log("MEssage===", message)
    const room = groupId || [socket.userId, receiverId].sort().join('-');
    io.to(room).emit('receiveMessage', { message, userId: socket.userId });
    console.log("Message sent to room:", room);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Watch for changes in the 'messages' collection
db.once('open', () => {
  console.log('Setting up change stream...');
  const messageCollection = db.collection('messages');
  const changeStream = messageCollection.watch();

  changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    // Determine the room and emit the change
    if (change.operationType === 'insert') {
      const message = change.fullDocument;
      console.log("message",message)
      const room = message.groupId || [message.senderId, message.receiverId].sort().join('-');
      console.log("Room ===", room)
      io.to(room).emit('receiveMessage', message);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
