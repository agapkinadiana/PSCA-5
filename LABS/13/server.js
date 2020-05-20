const net = require('net');
const config = require('./config').tcp;

/*
const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log('Server data', socket.remoteAddress + ': ' + data);
        socket.write('ECHO:' + data);
    });

    socket.on('close', () => {console.log('Server closed')});
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
*/

/*
let controlSum = 0;
const server = net.createServer(socket => {
    socket.on('data', data => {
        console.log(data, controlSum);
        controlSum += data.readInt32LE();
    });

    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);

    socket.on('close', () => clearInterval(interval));
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
*/

/*
let clientCount = 0;
const server = net.createServer(socket => {
    let controlSum = 0;
    let clientId = clientCount++;

    console.log(`Client ${clientId} has been connected`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        controlSum += data.readInt32LE();
    });

    let buffer = Buffer.alloc(4);
    let interval = setInterval(() => {
        console.log(`Control sum for a client ${clientId}: ${controlSum}`);
        buffer.writeInt32LE(controlSum, 0);
        socket.write(buffer);
    }, 5000);

    socket.on('close', () => clearInterval(interval));
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});
*/

/*
let clientCount = 0;
function clientHandler(socket, port) {
    let clientId = clientCount++;

    console.log(`Client ${clientId} has been connected to the port of ${port}`);
    socket.on('data', data => {
        console.log(data.readInt32LE() + ` - received from client ${clientId}`);
        socket.write(`ECHO: ${data.readInt32LE()}`);
    });
}

net.createServer(socket => clientHandler(socket, 40000)).listen(40000, config.host, () => {
    console.log(`Listening to ${config.host}:40000`);
});

net.createServer(socket => clientHandler(socket, 50000)).listen(50000, config.host, () => {
    console.log(`Listening to ${config.host}:50000`);
});
*/

/*
var dgram = require("dgram");
var server = dgram.createSocket('udp4');

var UdpPort = 7000;

server.on('listening', () => {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});
server.on('message', (message) => {
    console.log("Got message: " + message);
});

server.bind(UdpPort);
*/