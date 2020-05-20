let http = require('http');
let url = require('url');
let qs = require('querystring');
let fs = require('fs');
let parseString = require('xml2js').parseString;  //parser
let xmlbuilder = require('xmlbuilder');
let mp = require('multiparty');


let server = http.createServer(function(req, resp) {
    let parsedUrl = url.parse(req.url, true);
    let pathUrls = parsedUrl.pathname.split('/');

    if (parsedUrl.pathname === '/connection') {
        if (parsedUrl.query.set == undefined) {
            resp.writeHead(200, {'Content-type': 'text/plain'});
            resp.end(server.keepAliveTimeout.toString());  // how long the server is willing to keep the connection open
        } else {
            server.keepAliveTimeout = parseInt(parsedUrl.query.set);
            resp.writeHead(200, {'Content-type': 'text/plain'});
            resp.end(`Updated to ${server.keepAliveTimeout}`);
        }
    }
    else if (parsedUrl.pathname == '/headers') {
        resp.writeHead(200, {'Content-type': 'text/plain', 'Custom': 'bla-bla'});
        let result = '';
        Object.entries(req.headers).forEach(element => {   //return an array consisting of enumerable property [key, value] pairs of the object
            result += element[0] + ': ' + element[1] + '\n';
        });
        resp.end(result);
    }
    else if (parsedUrl.pathname == '/parameter') {
        resp.writeHead(200, {'Content-type': 'text/plain'});
        let value1 = parsedUrl.query.x;
        let value2 = parsedUrl.query.y;

        try {
            if (value1 == undefined || value2 == undefined)
                throw Error('x or y not passed');

            let x = parseInt(value1);
            let y = parseInt(value2);
            if (isNaN(value1) || isNaN(value2))
                throw Error('x or y is not a number');
            resp.end(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x * y}\nx / y = ${x / y}`);
        } catch (e) {
            resp.end(e.toString());
        }
    } else if (pathUrls[1] === 'parameter') {
        try {
            if (pathUrls.length != 4)
                throw Error('Invalid param count');
            let x = pathUrls[2];
            let y = pathUrls[3];
            if (x == undefined || y == undefined)
                throw Error('Something wrong');
            x = parseInt(x);
            y = parseInt(y);
            if (isNaN(x) || isNaN(y))
                throw Error('Args is nans!');

            resp.end(`x + y = ${x + y}\nx - y = ${x - y}\nx * y = ${x * y}\nx / y = ${x / y}`);
        } catch (e) {
            resp.end(e.toString());
        }
    }
    else if (parsedUrl.pathname == '/close') {
        resp.writeHead(200, {'Content-type': 'text/plain'});
        resp.end('Server will die in 10 seconds!\n');
        setTimeout(() => {
            server.close()
        }, 10000);
    }
    else if (parsedUrl.pathname == '/socket') {
        resp.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        resp.end(`<h4>
                            Remote address - ${req.connection.remoteAddress} <br>
                            Remote port - ${req.connection.remotePort} <br>
                            Local address - ${req.connection.localAddress} <br>
                            Local port - ${req.connection.localPort} <br>
                       </h4>`);
    }
    else if (parsedUrl.pathname == '/req-data') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            let o = qs.parse(data);
            let result = '';
            for (let key in o) {
                result += `${key} = ${o[key]}\n`;
            }
            resp.writeHead(200, {'Content-type': 'text/plain; charset=utf-8'});
            resp.end(result);
        });
    }
    else if (parsedUrl.pathname == '/resp-status') {
        try {
            let code = parsedUrl.query.code;
            let mess = parsedUrl.query.mess;
            if (code == undefined || mess == undefined)
                throw Error('Params error');

            code = parseInt(code);
            if (isNaN(code))
                throw Error('passed code is nan');

            resp.writeHead(code, {'Content-type': 'text/plain'});
            resp.statusMessage = mess;
            resp.end('Yeah!');
        } catch (e) {
            resp.writeHead(200, {'Content-type': 'text/plain'});
            resp.end(e.toString());
        }
    } else if (parsedUrl.pathname == '/formparameter') {
        if (req.method == 'GET') {
            resp.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
            resp.end('<head><meta charset="utf-8"></head>' +
                '<form method="POST" action="req-data">' +
                    '<input type="text" name="text_field" />' +
                    '<input name="first_button" type="submit" value="First" />' +
                    '<input name="submit_button" type="submit" /></form>');
        }
    } else if (parsedUrl.pathname == '/json') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            data = JSON.parse(data);
            resp.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let comment = 'Ответ.' + data.__comment.split('.')[1];
            let response = {};
            response.__comment = comment;
            response.x_plus_y = data.x + data.y;
            response.Concatenation_s_o = data.o.surname + ', ' + data.o.name;
            response.Length_m = data.m.length;
            resp.end(JSON.stringify(response));
        });
    } else if (parsedUrl.pathname == '/xml') {
        let data = '';
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            parseString(data, function (err, result) {
                resp.writeHead(200, {'Content-type': 'application/xml'});
                let id = result.request.$.id;  // access to attributes

                let xSum = 0;
                let mSum = '';
                result.request.x.forEach((p) => {  //elements
                    xSum += parseInt(p.$.value);  //get attribute value
                });
                result.request.m.forEach((p) => {
                    mSum += p.$.value;
                });

                let xmlDoc = xmlbuilder.create('response').att('id', id);
                xmlDoc.ele('sum').att('element', 'x').att('result', xSum).up().ele('concat').att('element', 'm').att('result', mSum);

                resp.end(xmlDoc.toString());
            });
        });
    } else if (parsedUrl.pathname == '/files') {
        resp.writeHead(200, {'X-static-files-count': fs.readdirSync('./static').length});
        resp.end();
    } else if (pathUrls[1] == 'files') {
        try {
            let data = fs.readFileSync('static/' + pathUrls[2]);
            resp.end(data);
        } catch (e) {
            resp.writeHead(404, {'Content-type': 'text/html'});
            resp.end('404 ' + e.toString());
        }
    } else if (parsedUrl.pathname == '/upload') {
        if (req.method == 'GET') {
            resp.writeHead(200, {'Content-type': 'text/html'});
            resp.end('<form method="POST" action="/upload" enctype="multipart/form-data">' +
                                '<input type="file" name="file"/>' +
                                '<input type="submit"/>' +
                            '</form>');
        } else if (req.method == 'POST') {
            let form = new mp.Form({uploadDir: './static'});
            form.on('file', (name, file) => {
            });
            form.on('close', () => {
                resp.writeHead(200, {'Content-type': 'text/plain'});
                resp.end("Uploaded!");
            });
            form.parse(req);
        }
    }
}).listen(5000);

console.log('http://localhost:5000');