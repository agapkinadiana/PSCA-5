const net = require('net');
const config = require('./config').tcp;

/*
const client = new net.Socket();

client.connect(config.port, config.host, () => {
    console.log('Client connected:', client.remoteAddress + ' ' + client.remotePort);
    client.write('Hello');
});

client.on('data', data => {
    console.log('Client data: ' + data);
    client.destroy();
});

client.on('close', ()=>{console.log('Client close')});
*/

/*
const client = new net.Socket();
let buffer = Buffer.alloc(4);
let counter = 0;

client.connect(config.port, config.host, () => {
    let interval = setInterval(() => {
        client.write((buffer.writeInt32LE(counter++, 0), buffer));  //(value, offset) - to write specified bytes into the buffer using big endian format
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
});

client.on('data', data => {
    console.log('From server: ' + data.readInt32LE());
});
*/

/*
const client = new net.Socket();
let buffer = Buffer.alloc(4);
let counter = Number(process.argv[2]);

client.connect(config.port, config.host, () => {
    let interval = setInterval(() => {
        client.write((buffer.writeInt32LE(counter, 0), buffer));
    }, 1000);

    setTimeout(() => {
        clearInterval(interval);
        client.end();
    }, 20000);
});

client.on('data', data => {
    console.log('From server: ' + data.readInt32LE());
});
*/

/*
const counter = Number(process.argv[2]);
const port = Number(process.argv[3]);
const buffer = Buffer.alloc(4);
const client = new net.Socket();

client.connect(port, config.host, () => {
    setInterval(() => {
        client.write((buffer.writeInt32LE(counter, 0), buffer));
    }, 1000);
}).on('data', data => {
    console.log('From server: ' + data);
});
*/

/*
var PORT = 7000;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer.from('Test Message');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, (err) => {
    if (err) throw err;
    console.log('Sent message to ' + HOST +':'+ PORT);
    client.close();
});
*/

