const webSocket = require('ws');

const  client = new webSocket('ws://localhost:3000/ws');
client.on('open', ()=>{
    client.send('Message1');
});

client.on('message', message=>{
    console.log('server ->'+ message);
    client.close();
});