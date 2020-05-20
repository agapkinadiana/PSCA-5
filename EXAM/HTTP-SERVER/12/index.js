const http = require ('http');
const fs = require ('fs');

const server = http.createServer(function (request,response) {
    if(request.url === '/get'){
        if(request.method ==='GET'){
            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            response.end('GET IS OKEY');
        }
        else{
            response.writeHead (400,{ 'Content-Type':'text/html;charset=utf-8'});
            response.end();
        }
    }
    else if(request.url === '/post'){
        if (request.method ==='POST'){
            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            response.end('POST IS OKEY');
        }
        else{
            response.writeHead (400,{ 'Content-Type':'text/html;charset=utf-8'});
            response.end();
        }
    }
    else if (request.url === '/put'){
        if (request.method ==='PUT'){
            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
            response.end('PUT IS OKEY');
        }
        else{
            response.writeHead (400,{ 'Content-Type':'text/html;charset=utf-8'});
            response.end();
        }
    }
    else if (request.url === '/delete'){
     if (request.method ==='DELETE'){
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        response.end('DELETE IS OKEY');}
     else{
         response.writeHead (400,{ 'Content-Type':'text/html;charset=utf-8'});
         response.end();
     }
    }
    else{
        response.writeHead (404,{ 'Content-Type':'text/html;charset=utf-8'});
        response.end();
    }


}).listen(3000);
console.log('run');