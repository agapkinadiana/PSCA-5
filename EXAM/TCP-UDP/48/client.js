
const net = require('net');
const fs = require('fs');
const config = require('./config').tcp;

const client = new net.Socket();

client.connect(config.port, config.host, () => {
    console.log('Client connected:', client.remoteAddress + ' ' + client.remotePort);
});

client.on('close', ()=>{console.log('Client close')});

client.on('data', data => {
    console.log('From server: ' + data);
});