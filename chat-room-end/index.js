const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    const users = {} // 声明一个用户对象
    users[socket.id] = socket.handshake.query.username; // socket.id是自带的唯一标识，用于区分不同的用户访问socket服务器，username是前端在连接socket的时候传递过来的

    socket.on('chat message', (msg) => { // 监听chat message事件
        io.emit('chat message', `${users[socket.id]}说:${msg}`); // 发消息
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});