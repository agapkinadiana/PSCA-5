const WebSocket = require('ws');

const socket = new WebSocket('ws:/localhost:4000');

socket.onmessage = message => {
    console.log('From server: ' + message.data);
    socket.close();
};

socket.onopen = () => {
    socket.send('Client connected');
};
