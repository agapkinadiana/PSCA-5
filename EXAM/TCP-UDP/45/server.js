const webSocket = require('ws');

const  socket = new webSocket.Server({host:'localhost', port:3000, path:'/ws'});
socket.on('connection', client=>{
    client.on('message', message => {
        console.log('Message '+ message);
        client.send('Hello');
    })
})
