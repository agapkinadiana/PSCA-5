const net = require("dgram");

let PORT = 3000;

let server = net.createSocket("udp4");

server.on("error", (err)=>{
    console.log("Error: " + err);
});

server.on("message", (msg, info)=>{
    console.log("Client sent: " + msg);
    console.log("Info Client: message length %d bytes from %s:%d",msg.length, info.address, info.port);

    server.send(msg, info.port, info.address, (err)=>{
        if(err){
            server.close();
        } else {
            console.log("Message has been sent to client");
        }
    });
});

server.on("listening", ()=>{
    console.log("Server is listening:\n \t%d\n\tip:%s\n\tfamily%s",server.address().port, server.address().address, server.address().family);
});

server.on("close", ()=>{
    console.log("server is closed");
});

server.bind(PORT);