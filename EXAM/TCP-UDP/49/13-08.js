const net=require('net'); //node 13-08.js 50000

let HOST='127.0.0.1';
let PORT = process.argv[2];

let client=new net.Socket();
let buf=new Buffer.alloc(4);
let timerID=null;

client.connect(PORT,HOST,()=>
{
    let k=0;
    console.log('Client connected:',client.remoteAddress+' '+client.remotePort);
    timerID= setInterval(()=>
    {
        client.write(`client: ${++k}`);
    },1000);
    setTimeout(()=>
    {
        clearInterval(timerID);
        client.end();
    },20000);
})
client.on('data',(data)=>
{
    console.log('Client DATA: ', data.toString());
});
client.on('close ', ()=>
{
    console.log('Client close');
});
client.on('error',()=>
{
    console.log('Client error');
})
