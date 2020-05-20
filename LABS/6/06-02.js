var http = require('http');
var url = require('url');
var fs = require('fs');
const {send} = require('./m06-03');
const sendmail=require('sendmail')({
    silent:true,
    smtpHost: 'localhost'
});
const {parse} = require('querystring'); //utilities for parsing and formatting URL query strings

http.createServer(function (request, response) {
    if (url.parse(request.url).pathname === '/' && request.method == 'GET') {
        let html = fs.readFileSync('./06-02.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    } else if (url.parse(request.url).pathname === '/' && request.method == 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            console.log(body);
            let parm = parse(body);
            sendmail({
                from: parm.sender,
                to: parm.receiver,
                subject: 'testSendmail',
                html: parm.message
            }, function (err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
            response.end(`<h1>OK: ${parm.sender}, ${parm.receiver}, ${parm.message} </h1>`)
        });
    } else if (url.parse(request.url).pathname === '/send') {
        send("<h1>Hello</h1>");
    } else response.end('<h1>Not support</h1>');
}).listen(5000);
