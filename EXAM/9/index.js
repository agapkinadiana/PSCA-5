const  http = require('http');
const  url = require('url');

const  server = http.createServer(function (req,res) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        if(req.method==='GET'){

            let result= 'url:'+ req.url;
            let  version = 'version:'+ req.httpVersion;
            let method= 'method:'+ req.method;
            let head= 'head:'+JSON.stringify(req.headers);

            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.write(method+'<br/>');
            res.write(head+'<br/>');
            res.write(version + '<br/>');
            res.write(body + '<br/>');
            res.end(result);
        }
        else{
            res.writeHead (404,{ 'Content-Type':'text/html;charset=utf-8'});
            res.end();
        }
    });
}).listen(3000);
console.log('Server work ');