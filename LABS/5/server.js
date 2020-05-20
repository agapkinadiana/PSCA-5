const http = require("http");
const url = require("url");
const fs = require("fs");
const Emitter = require("events");

const data = require("./m04-02.js");
const db = new data.DB();

let countReq = 0;
let countComm = 0;
let jsonSS;
let emitter = new Emitter();
let start = new Date();
let finish;

db.on("POST", (req, res) => {
    countReq++;
    req.on("data", data=>{
         let req_data = JSON.parse(data);
         db.post(req_data);
         res.end(JSON.stringify(req_data));         
    });
    
});

db.on("GET", (req, res) => {
    countReq++;
    res.end(JSON.stringify(db.get()));});

db.on("PUT", (req, res) => {
    countReq++;
    req.on("data", (data)=>{
        let req_data = JSON.parse(data);
        db.put(req_data);
        res.end(JSON.stringify(req_data));
    });
});

db.on("DELETE", (req, res) => {
    countReq++;
    req.on("data", data=>{
        let req_data = JSON.parse(data);
        db.delete(req_data);
        res.end(JSON.stringify(req_data));         
   });
});

db.on("COMMIT", () => {
    countComm++;
    console.log("commit");
    db.commit();
});

http.createServer(function(request, response){

   if(url.parse(request.url).pathname === "/"){
       let html = fs.readFileSync("index.html");
       response.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
       response.end(html);
   } else if(url.parse(request.url).pathname === "/api/db"){
       db.emit(request.method, request, response);
   } else if(url.parse(request.url).pathname === "/api/ss"){
       response.end(jsonSS);
   }

}).listen(3000);

let chunk = null;
let sdTimer;
let scInterval;
let ssIntervalTimeout;

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
    while ((chunk = process.stdin.read()) != null) {
        var words = chunk.split(" ");
        if (words[0] === "sd") {
            if ((String)(words[1]).trim().length == 0 || words[1] == undefined) {
                clearTimeout(sdTimer);
                console.log("Server has been closed");
            } else {
                // Close server if the app is still running n seconds from now
                sdTimer = setTimeout(() => {
                    server.close();
                    console.log("Server has been closed " + words[1]);
                }, words[1]);
                //But still shutdown cleanly if it wants to stop before the:
                sdTimer.unref();
            }
        } else if (words[0] === "sc") {
            if ((String)(words[1]).trim().length == 0 || words[1] == undefined) {
                clearInterval(scInterval);
            } else {
                scInterval = setInterval(() => {
                    db.emit("COMMIT");
                }, words[1]);
                scInterval.unref();
            }
        }
        if (words[0] === "ss") {
            if ((String)(words[1]).trim().length == 0 || words[1] == undefined) {
                finish = new Date();
                var obj = {
                    start: start.toUTCString(),
                    finish: finish.toUTCString(),
                    request: countReq,
                    commit: countComm
                };
                jsonSS = JSON.stringify(obj);
                console.log("Staistics collected");
                clearTimeout(ssIntervalTimeout);
            } else {
                start = new Date();

                ssIntervalTimeout = setTimeout(() => {
                    finish = new Date();
                    var obj = {
                        start: start.toUTCString(),  //converts a Date object to a string, according to universal time
                        finish: finish.toUTCString(),
                        request: countReq,
                        commit: countComm
                    };
                    jsonSS = JSON.stringify(obj);
                    countComm = 0;
                    countReq = 0;
                    finish = null;
                    start = null;
                    console.log("Staistics collected " + words[1]);
                }, words[1]);
                ssIntervalTimeout.unref();
            }
        }
        /*if (words[0] === "count") {
            console.log(jsonSS);
        }*/
    }
})
