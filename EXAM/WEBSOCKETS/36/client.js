const WebSocket = require('ws');
const RPCWebSocket = require('rpc-websockets').Client;
const fs = require('fs');

const notificationSocket = new RPCWebSocket('ws://localhost:4000');
notificationSocket.on('open', () => {
    console.log('Type one from A, B, C to send to the server appropriate notification');
    let input = process.stdin;
    input.setEncoding('utf-8');
    process.stdout.write('> ');
    input.on('data', data => {
        notificationSocket.notify(data.slice(0, -2));
        process.stdout.write('> ');
    });
});