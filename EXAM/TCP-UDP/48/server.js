
const net = require('net');
const fs = require('fs');
const config = require('./config').tcp;

let ws = require('fs').createReadStream('./file.txt');

let server = net.createServer();

server.on('connection', (sock)=>{
    ws.pipe(sock);
})

server.listen(config.port, config.host, () => {
    console.log(`Listening to ${config.host}:${config.port}`);
});