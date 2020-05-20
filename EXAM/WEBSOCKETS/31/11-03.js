let fs=require('fs');
const WebSocket=require('ws');

const broadcastSocket = new WebSocket.Server({
    port: 4000,
    host: 'localhost',
    path: '/'
});
let outMessageCount = 0;
broadcastSocket.on('connection', ws => {
    ws.on('pong', data => {
        console.log('working client detected: ' + data);
    });

    setInterval(() => {
        broadcastSocket.clients.forEach(client => {
            client.ping('ping');
        })
    }, 5000);

    setInterval(() => {
        broadcastSocket.clients.forEach(client => {
            client.send('11-03-server: ' + outMessageCount++);
        });
    }, 15000);
});