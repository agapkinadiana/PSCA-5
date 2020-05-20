const WebSocket = require('ws');
const RPCWebSocket = require('rpc-websockets').Client;
const fs = require('fs');

/*const socket = new WebSocket('ws://localhost:4000/');
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
function saveFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let writeFileStream = fs.createWriteStream(__dirname +  `/uploads-from/file${filesCount++}.txt`);
    duplex.pipe(writeFileStream);
}
function sendFile(ws) {
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let readFileStream = fs.createReadStream(__dirname + '/uploads-from/test.txt');
    readFileStream.pipe(duplex);
}*/


/*const broadcastSocket = new WebSocket('ws://localhost:4000/');
broadcastSocket.onopen = () => {
    setInterval(() => {
        broadcastSocket.ping('ping');
    }, 5000);
};
broadcastSocket.on('pong', data => {
    console.log(data + ' - pong');
});*/

/*const name = process.argv[2];
const jsonSocket = new WebSocket('ws://localhost:4000/');
jsonSocket.onopen = () => {
    let message = {client: name, timestamp: Date.now()};
    jsonSocket.send(JSON.stringify(message));
};
jsonSocket.onmessage = message => {
    console.log(message.data);
};*/

/*const rpcSocket = require('rpc-websockets').Client;
const socket = new rpcSocket('ws://localhost:4000');
socket.on('open', () => {
    socket.call('square', [5]).then(answer => console.log('square: ' + answer));
    socket.call('square', [5, 4]).then(answer => console.log('square: ' + answer));
    socket.call('sum', [2, 4, 6, 8, 10]).then(answer => console.log('sum: ' + answer));
    socket.call('mul', [3, 5, 7, 9, 11, 13]).then(answer => console.log('mul: ' + answer));

    socket.login({login: 'admin', password: 'admin'})
        .then(async login => {
            if (login) {
                socket.call('fib', 7).then(answer => console.log('fib: ' + answer));
                socket.call('fact', 5).then(answer => console.log('fact: ' + answer));
                await calculateDifficultExpression()
            } else {
                console.log('Unauthorized');
            }
        });
});

async function calculateDifficultExpression() {  //returns promise
    console.log(
        'Complicated expression result: '
        + await socket.call('sum', [           //waiting for completion
            await socket.call('square', [3]),
            await socket.call('square', [5, 4]),
            await socket.call('mul', [3, 5, 7, 9, 11, 13])
        ])
        // fib function gets as a result an array of numbers
        + (await socket.call('fib', 7)).reduce((a, b) => a + b, 0)
        * await socket.call('mul', [2, 4, 6])
    );
}*/

/*const eventSocket = new RPCWebSocket('ws://localhost:4000');
eventSocket.on('open', () => {
    eventSocket.subscribe('A');
    eventSocket.subscribe('B');
    eventSocket.subscribe('C');

    eventSocket.on('A', () => console.log('A event was fired'));
    eventSocket.on('B', () => console.log('B event was fired'));
    eventSocket.on('C', () => console.log('C event was fired'));
});*/

/*const notificationSocket = new RPCWebSocket('ws://localhost:4000');
notificationSocket.on('open', () => {
    console.log('Type one from A, B, C to send to the server appropriate notification');
    let input = process.stdin;
    input.setEncoding('utf-8');
    process.stdout.write('> ');
    input.on('data', data => {
        notificationSocket.notify(data.slice(0, -1));
        process.stdout.write('> ');
    });
});*/

//Remote Procedure Call
//Для того чтобы вызывать удаленные процедуры на другом компьютере.