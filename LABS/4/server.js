const http = require("http");
const url = require("url");
const fs = require("fs");

const data = require("./m04-02.js");
const db = new data.DB();

db.on("POST", (req, res) => {
    req.on("data", data=>{
         let req_data = JSON.parse(data);  //convert this to a javascript object
         db.post(req_data);
         res.end(JSON.stringify(req_data));         
    });
    
});

db.on("GET", (req, res) => {
    res.end(JSON.stringify(db.get()));
});

db.on("PUT", (req, res) => {
    req.on("data", (data)=>{
        console.log("PUT");
        let req_data = JSON.parse(data);
        db.put(req_data);
        res.end(JSON.stringify(req_data));
    });
});

db.on("DELETE", (req, res) => {  //subscribe
    req.on("data", data=>{
        console.log("DELETE");
        let req_data = JSON.parse(data);
        db.delete(req_data);
        res.end(JSON.stringify(req_data));         
   });
});

http.createServer(function(request, response){

   if(url.parse(request.url).pathname === "/"){
       let html = fs.readFileSync("./index.html");
       response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
       response.end(html);
   } else if(url.parse(request.url).pathname === "/api/db"){
       db.emit(request.method, request, response);  //generate event
   }

}).listen("3000");