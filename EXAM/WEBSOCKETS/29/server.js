const WebSocket = require('ws');

const broadcastSocket = new WebSocket.Server({
    port: 5000,
    host: 'localhost',
    path: '/'
});

let broadcastClientsCount = 0;

broadcastSocket.on('connection', ws => {
    ws.on('message', () => {
        if (++broadcastClientsCount === 2) {
            broadcastSocket.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('Broadcast message!');
                }
            });
        }
    });
});

