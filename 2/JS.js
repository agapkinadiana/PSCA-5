var http = require('http');
var fs = require('fs');

http.createServer(function(request, response){
    if(request.url==='/html'){
        let html = fs.readFileSync('./HTML.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

    else if(request.url==='/xmlhttprequest'){
        let html = fs.readFileSync('./xmlhttprequest.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

    else if(request.url==='/fetch'){
        let html = fs.readFileSync('./fetch.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

    else if(request.url==='/jquery'){
        let html = fs.readFileSync('./iquery.html');
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }

    else if (request.url==='/api/name') {
        response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        response.end('Hello world');
    }

    else if (request.url==='/png') {
        const fname = './1.png';
        let jpg = null;

        fs.stat(fname, (err, stat)=> {
         if(err){console.log('error:', err);}
         else {
             jpg = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type': 'image/jpeg', 'Content-Length':stat.size});
                response.end(jpg, 'binary');
        }
    });
}
}).listen(5000);