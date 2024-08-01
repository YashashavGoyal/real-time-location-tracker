const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// Setup ejs & public
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    // sending received location to frontend
    socket.on("send-location", function (data) {
        io.emit("receive-location", {
            id: socket.id,
            ...data,
        })
    });

    // handling on disconnected
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    })
});

app.get('/', (req, res) => {
    res.render("index");
});

const port = 2024;
const host = '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server is started at http://${host}:${port}`);
});
