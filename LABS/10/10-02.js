const WebSocket = require('ws');

const ws = new WebSocket('ws:/localhost:4000/ws');
let k=0;

ws.on('open',()=> {
    messageInterval = setInterval(() => {
        ws.send(++k);
    }, 3000);

    ws.on('message', (message) => {
        console.log(`${message}`);
    })

    setTimeout(() => {
        clearInterval(messageInterval);
        ws.close();
    }, 25000);
})
ws.on('error', function(error){alert('Error '+ error.message);});