const WebSoket = require('ws');

const ws = new WebSoket('ws://localhost:3000/ws');
const duplex = WebSoket.createWebSocketStream(ws,{encoding:'utf8'});
duplex.pipe(process.stdout);
process.stdin.pipe(duplex);


/*const ws = new WebSoket('ws://localhost:3000/ws');
ws.on('open',()=>{
    ws.send('message 1');
    ws.send('message 2');
    ws.on('message', message =>{
        console.log(`Received message => ${message}`)
    })
});*/