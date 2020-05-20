const rpcWSC = WebSocket = require('rpc-websockets').Client;

let ws = new rpcWSC('ws://localhost:4000');

ws.on('open',() => {
    ws.subscribe('Change file');
    ws.on('Change file', () => {
        console.log('Event Change file');
    });
});