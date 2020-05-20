const net=require('net');
let HOST='0.0.0.0';

let PORT1 = 4000;
let PORT2 = 5000;

let h=(n)=>{return (sock)=>
{
    console.log('Server Connected: '+ sock.remoteAddress+':'+sock.remoteAddress);
    sock.on('data',(data)=>
    {
        console.log('Server DATA: ',data.toString());
        sock.write('ECHO:'+data);
    });
    sock.on('close',(data)=>
    {
        console.log("Server closed: ",sock.remoteAddress+' '+sock.remotePort);
    });
    sock.on('error',(e)=>
    {
        console.log("Server error: ",sock.remoteAddress+' '+sock.remotePort);
        console.log(e);
    });
  };
};

net.createServer(h(PORT1)).listen(PORT1,HOST).on('listening',()=>
{
    console.log('TCP-server ',HOST+':'+PORT1);
});
net.createServer(h(PORT2)).listen(PORT2,HOST).on('listening',()=>
{
    console.log('TCP-server ',HOST+':'+PORT2);
});