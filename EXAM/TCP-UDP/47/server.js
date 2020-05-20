const net = require('net');
const fs = require('fs');
const config = require('./config').tcp;

const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log('From client: ' + data);
    });

    socket.on('close', () => {console.log('Server closed')});
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
