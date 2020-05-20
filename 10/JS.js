const express = require('express');
const WebSocket = require('ws');

const HTTP_PORT = 3000;
const WS_PORT = 4000;
const BROADCAST_WS_PORT = 5000;

const HOST = 'localhost';
const WS_ENDPOINT_PATH = '/';

const app = express();

const socket = new WebSocket.Server({
    port: WS_PORT,
    host: HOST,
    path: WS_ENDPOINT_PATH
});

const broadcastSocket = new WebSocket.Server({
    port: BROADCAST_WS_PORT,
    host: HOST,
    path: WS_ENDPOINT_PATH
});

let clientMessagesCount = 1;
let lastClientMessageNumber = -1;
let broadcastClientsCount = 0;

socket.on('connection', ws => {
    ws.on('message', message => {
        console.log('Message: ' + message);
        lastClientMessageNumber = JSON.parse(message).client;
    });

    setInterval(() => {
        ws.send(JSON.stringify({server: `${lastClientMessageNumber}->${clientMessagesCount}`}));
    }, 5000);
});

broadcastSocket.on('connection', ws => {
    ws.on('message', () => {
        if (++broadcastClientsCount === 3) {
            broadcastSocket.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('Broadcast message!');
                }
            });
        }
    });
});


app.use('/', (request, response) => {
    if (request.method === 'GET' && request.originalUrl === '/start') {
        response.sendFile(__dirname + '/HTML.html');
    } else {
        response.statusCode = 400;
        response.end();
    }
});

app.listen(HTTP_PORT, () => {
    const URL = `http://${HOST}:${HTTP_PORT}/start`;
    console.log('Listening on ' + URL);
});