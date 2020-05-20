const net=require('net');

let HOST='0.0.0.0';
let PORT = 40000;

let server =net.createServer();

server.on('connection',(sock)=> {
    let sum = 0;
    console.log('Server Connected: ' + sock.remoteAddress + ':' + sock.remoteAddress);
    sock.on('data', (data) => {
        console.log('Server DATA: ', data, sum);
        sum += data.readInt32LE();
    });
    let buf = Buffer.alloc(4);
    let x = setInterval(() => {
        buf.writeInt32LE(sum, 0);
        sock.write(buf);
    }, 5000);
    sock.on('close', (data) => {
        console.log("Server closed: ", sock.remoteAddress + ' ' + sock.remotePort);
        clearInterval(x);
    });
    sock.on('error', (e) => {
        console.log("Server error: ", sock.remoteAddress + ' ' + sock.remotePort);
        console.log(e);
    });
});
server.on('listening',()=>
{
    console.log('TCP-server ',HOST+':'+PORT);
});
server.on('error',(e)=>
{
    console.log('TCP-server error ',e);
});
server.listen(PORT,HOST);