import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
const PORT = process.env.PORT || 3001;
// import consoleLogger from './src/config/consoleLogger';
// const console = consoleLogger(module);
import { message, room, user } from './src/routes';
import { SERVER_VERSION } from './src/config';
import { errorhandler } from './src/middleware';
// eslint-disable-next-line no-unused-vars
import connectDB from './src/config/db.config'; //before uncomment this line you should define mongodb credentials in env
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
app.use(baseUrl, user);

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
let users = [];

const addUser = (userInfo, socketId) => {
    !users.some((user) => user.id === userInfo.id) &&
        users.push({ ...userInfo, socketId });
};
const getUser = (userId) => {
    return users.find((user) => user.id === userId);
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    return users;
};
// socket connection here

io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    // video calling
    socket.on('callUser', ({ userToCall, signalData, from, name }) => {
        const user = getUser(userToCall);
        if (user && user.socketId) {
            // io.to(user.socketId).emit('receivedMessage', info);
            io.to(user.socketId).emit('callUser', {
                signal: signalData,
                from,
                name,
            });
        }
    });
    socket.on('answerCall', (data) => {
        const user = getUser(data.to);
        if (user && user.socketId) {
            // io.to(user.socketId).emit('receivedMessage', info);
            io.to(user.socketId).emit('callAccepted', data.signal);
        }
    });
    // video calling ended

    // socket.on('join_room', (room) => {
    //     socket.join(room);
    //     // console.info(`User : ${socket.id} joined in this ${room}`);
    // });
    socket.on('typing', (data) => {
        if (data.removeTyping) socket.broadcast.emit('typingRemove', data.id);
        else {
            socket.broadcast.emit('typingResponse', data.id);
        }
    });

    socket.on('sendMessage', (info) => {
        const user = getUser(info.receiverId);
        if (user && user.socketId) {
            io.to(user.socketId).emit('receivedMessage', info);
        }
    });

    socket.on('add-user', (userInfo) => {
        addUser(userInfo, socket.id);
        io.emit('get-users', users);
    });
    // socket.on('callUser', (data) => {
    //     console.log('Calling', data.userToCall);

    //     io.to(data.userToCall).emit('callUser', {
    //         signal: data.signalData,
    //         from: data.from,
    //         name: data.name,
    //     });
    // });
    // socket.on('answerCall', (data) => {
    //     console.log('Call answerCall', data.to);
    //     io.to(data.to).emit('callAccepted', data.signal);
    // });

    socket.on('disconnect', () => {
        // console.info(`User disconnect : ${socket.id}`);
        const filterUsers = removeUser(socket.id);
        //Sends the list of users to the client
        io.emit('get-users', filterUsers);
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
