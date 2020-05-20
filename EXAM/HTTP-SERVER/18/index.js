const http = require('http');
const url = require('url');
const parseString = require('xml2js').parseString;
const xmlbuilder = require('xmlbuilder');

const server = http.createServer(function (request, response) {
    let parsedUrl = url.parse(request.url, true)
    let pathUrls = parsedUrl.pathname.split('/');
    if(parsedUrl.pathname == '/xml'){
        if(request.method ==='POST'){
            let data = '';
            request.on("data",(chunk) => {
                data += chunk;
            });
            request.on("end", () =>{
                parseString(data, (error, result) => {
                    response.writeHead(200, {'Content-type': 'application/xml'});
                    let id = result.request.$.id;
                    let xId = 0;
                    let mName = '';
                    result.request.x.forEach((p)=>{
                        xId += parseInt(p.$.value);
                    });
                    result.request.m.forEach((p)=>{
                        mName += p.$.value;
                    });
                    let xmlDoc = xmlbuilder.create('response').att('id', id);
                    xmlDoc.ele('sum').att('element', 'x')
                        .att('result', xId).up().ele('concat')
                        .att('element', 'm').att('result', mName);

                    response.end(xmlDoc.toString());
                })
            })
        }
        else{
            response.writeHead (404,{ 'Content-Type':'text/html;charset=utf-8'});
            response.end();
        }
    }
    else{
        response.writeHead (404,{ 'Content-Type':'text/html;charset=utf-8'});
        response.end();
    }


}).listen(3000);
console.log('Run server');