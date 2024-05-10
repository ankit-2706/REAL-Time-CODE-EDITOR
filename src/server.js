const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io')
const ACTIONS = require('../src/Actions')

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    //Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: userSocketMap[socketId],

        };
    });

}

//event trigger
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients);

        
    })

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
