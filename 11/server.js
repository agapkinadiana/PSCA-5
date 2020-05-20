const WebSocket = require('ws');
const RPCWebSocket = require('rpc-websockets').Server;
const fs = require('fs');

const PORT = 4000;
const HOST = 'localhost';

/* TODO: Uncomment necessary task here and from client too */

/*const socket = new WebSocket.Server({
    port: PORT,
    host: HOST,
    path: '/'
});
let filesCount = 0;

socket.on('connection', ws => {
    ws.on('message', message => {
        if (message === 'start') {
            //saveFile(ws);
            sendFile(ws);
        }
    });
});
function saveFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let writeFileStream = fs.createWriteStream(__dirname +  `/uploads-to/file${filesCount++}.txt`);
    duplex.pipe(writeFileStream);
}
function sendFile(ws) {
    ws.send('start');
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readFileStream = fs.createReadStream(__dirname +  '/uploads-to/server-test.txt');
    readFileStream.pipe(duplex);
}*/



/*const broadcastSocket = new WebSocket.Server({
    port: PORT,
    host: HOST,
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
});*/

/*const jsonSocket = new WebSocket.Server({
    port: PORT,
    host: HOST,
    path: '/'
});
let messageCount = 0;
jsonSocket.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message);
        message.server = messageCount++;
        ws.send(JSON.stringify(message));
        console.log(message);
    });
});*/

/*const socket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});
socket.setAuth(credentials => credentials.login === 'admin' && credentials.password === 'admin');
socket.register('sum', params => params.reduce((a, b) => a + b, 0)).public();
socket.register('mul', params => params.reduce((a, b) => a * b, 1)).public();
socket.register('square', square).public();
socket.register('fib', fib).protected();
socket.register('fact', fact).protected();

function square(args) {
    if (args.length === 1) {
        return Math.PI * Math.pow(args[0], 2);
    } else if (args.length === 2) {
        return args[0] * args[1];
    } else {
        return 0;
    }
}
function fib(n) {
    let currentSize = 0;
    let numbers = [];
    let curr = 1;
    let next = 1;
    while (currentSize < n) {
        numbers.push(curr + next);
        next += curr;
        curr = next - curr;
        currentSize++;
    }
    return numbers;
}
function fact(n) {
    return n === 1 ? 1 : n * fact(n - 1);
}*/

/*const eventSocket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});
eventSocket.event('A');
eventSocket.event('B');
eventSocket.event('C');

console.log('Type A, B or C to fire such events');
let input = process.stdin;
input.setEncoding('utf-8');
process.stdout.write('> ');
input.on('data', data => {
    eventSocket.emit(data.slice(0, -1));
    process.stdout.write('> ');
});*/

/*const notificationSocket = new RPCWebSocket({
    port: PORT,
    host: HOST,
    path: '/'
});
notificationSocket.register('A', () => console.log('A notification was received')).public();
notificationSocket.register('B', () => console.log('B notification was received')).public();
notificationSocket.register('C', () => console.log('C notification was received')).public();
*/
