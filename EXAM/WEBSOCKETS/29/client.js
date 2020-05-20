const WebSocket = require('ws');

const socket = new WebSocket('ws:/localhost:5000');

socket.onmessage = message => {
    console.log('Broadcast message: ' + message.data);
    socket.close();
};

socket.onopen = () => {
    socket.send('Client connected');
};
