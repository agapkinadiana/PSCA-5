const upd = require("dgram");
const buffer = require("buffer");

let PORT = "3000";
let client = upd.createSocket("udp4");

let stdin = process.openStdin();
let chunk;

client.on("message", (msg, info)=>{
    console.log("Server sent: " + msg);
    console.log("Info Server: message length %d bytes from %s:%d",msg.length, info.address, info.port);
});

let data = Buffer.from("Client message 1");

client.send(data, PORT, "localhost", (err)=>{
    if(err){
        client.close();
    } else {
        console.log("Message has been sent to server");
    }
});

let data1 = "Hello ";
let data2 = "World\n";

client.send([data1, data2], PORT, "localhost", (err)=>{
    if(err){
        client.close();
    } else {
        console.log("Message has been sent to server");
    }
});