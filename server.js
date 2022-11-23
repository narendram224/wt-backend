import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
const PORT = process.env.PORT || 3001;
import consoleLogger from './src/config/consoleLogger';
const console = consoleLogger(module);
import { message, room } from './src/routes';
import { SERVER_VERSION } from './src/config';
import { errorhandler } from './src/middleware';
// eslint-disable-next-line no-unused-vars
// import connectDB from './src/config/db.config'; //before uncomment this line you should define mongodb credentials in env
const app = express();

// uncatchException handle here
process.on('uncaughtException', (err) => {
    console.info('Shutting down the server due to uncatch exception', err);
    process.exit(1);
});

// middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const baseUrl = `/api/${SERVER_VERSION}`;

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
    });
});

// setup routes
app.use(baseUrl, message);
app.use(baseUrl, room);
app.use(errorhandler);
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'URl not found !!' });
});

// server setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ['GET', 'POST'], //React server
    },
});

// socket connection here

io.on('connection', (socket) => {
    socket.on('join_room', (room) => {
        socket.join(room);
        console.room(`User : ${socket.id} joined in this ${room}`);
    });
    socket.on('send_message', (message) => {
        socket.to(message.room).emit('receive_message', message);
    });
    socket.on('disconnect', () => {
        console.room(`User disconnect : ${socket.id}`);
    });
});

// listing the server
server.listen(PORT, () => {
    console.info(`Server listening on port : ${PORT}`);
});

// Hanlde unhandle promise rejection
process.on('unhandledRejection', (err) => {
    console.info(
        'Shutting down the server due to the unhandledRejection',
        err.message
    );
    server.close(() => {
        process.exit(1);
    });
});
