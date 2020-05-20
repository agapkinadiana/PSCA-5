const WebSocket = require('ws');
const fs = require('fs');

const socket = new WebSocket('ws://localhost:4000/');
let filesCount = 0;

socket.onopen = () => {
    socket.send('start');
    sendFile(socket);
};

socket.onmessage = message => {
    if (message.data === 'start') {
        //saveFile(socket);
    }
};

//setTimeout(() => {}, 5000);
/*function saveFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let writeFileStream = fs.createWriteStream(__dirname +  `/uploads-from/file${filesCount++}.txt`);
    duplex.pipe(writeFileStream);
}*/
function sendFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readFileStream = fs.createReadStream(__dirname + '/uploads-from/test.txt');
    readFileStream.pipe(duplex);
}