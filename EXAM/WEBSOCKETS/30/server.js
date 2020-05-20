const WebSoket = require('ws');

const wsserver = new WebSoket.Server({port:3000, host:'localhost', path:'/ws'});
wsserver.on('connection', (ws)=>{
    ws.on('message', message=>{
        console.log(`Received message => ${message}`)
    })
});
wsserver.on('error',(e)=>{console.log('error',e)});
console.log(`ws server: host:${wsserver.options.host}, port:${wsserver.options.port}, path:${wsserver.options.path}`);
