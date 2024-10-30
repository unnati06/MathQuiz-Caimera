const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const router = require("./routers/auth-route");
const generateRandomQuestion = require('./utils/generateQuestion');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', router);

const generateRoomCode = () => Math.random().toString(36).substring(2, 7).toUpperCase(); // Generates a 5-character code
let currentRoomCode = generateRoomCode();
let currentQuestion = generateRandomQuestion();
let answerSubmitted = false; // Move this outside the socket connection

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('New client connected');

    // Emit the current room code to any new connected user
    socket.emit('roomCode', { roomCode: currentRoomCode });
    console.log(`Generated Room Code: ${currentRoomCode}`); 
    socket.emit('newQuestion', { question: currentQuestion.question });
    console.log(`Generated Question: ${currentQuestion.question}`); 

    socket.on('joinRoom', ({ roomCode, name }) => {
        if (roomCode === currentRoomCode) {
            socket.join(roomCode);
            console.log(`${name} joined room: ${roomCode}`);
            io.to(roomCode).emit('userJoined', { userName: name });
            io.to(roomCode).emit('newQuestion', { question: currentQuestion.question });
        } else {
            socket.emit('error', { message: 'Invalid room code' });
        }
    });

    socket.on('generateNewQuestion', () => {
        currentQuestion = generateRandomQuestion();
        answerSubmitted = false; // Reset the answerSubmitted flag for new question
        io.to(currentRoomCode).emit('newQuestion', { question: currentQuestion.question });
    });

    socket.on('submitAnswer', ({ answer, userName }) => {
        console.log(`${userName} submitted: ${answer}`);
        if (!answerSubmitted && parseFloat(answer) === currentQuestion.answer) {
            answerSubmitted = true; // Mark as submitted to prevent multiple winners
            io.to(currentRoomCode).emit('winner', { winner: userName, correctAnswer: answer });
            console.log(`${userName} is the winner with the answer: ${answer}`);

            // Announce the winner and generate a new question after a delay
            setTimeout(() => {
                currentQuestion = generateRandomQuestion();
                answerSubmitted = false; // Reset for the next question
                io.to(currentRoomCode).emit('newQuestion', { question: currentQuestion.question });
                console.log(`New Question Generated: ${currentQuestion.question}`);
            }, 20000); // 20 seconds delay
        } else {
            // Optionally broadcast the wrong answer
            io.to(currentRoomCode).emit('answerSubmitted', { answer, userName });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
