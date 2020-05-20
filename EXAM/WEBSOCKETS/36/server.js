const WebSocket = require('ws');
const RPCWebSocket = require('rpc-websockets').Server;
const fs = require('fs');

const PORT = 4000;
const HOST = 'localhost';

const notificationSocket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});
notificationSocket.register('A', () => console.log('A notification was received')).public();
notificationSocket.register('B', () => console.log('B notification was received')).public();
notificationSocket.register('C', () => console.log('C notification was received')).public();
