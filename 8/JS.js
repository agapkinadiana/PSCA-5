const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const xmlBodyParser = require('express-xml-bodyparser');
const bodyParser = require('body-parser');

const HOST = 'localhost';
const PORT = 8000;

const app = express();

app.use(fileUpload({
    createParentPath: true
}));
app.use(xmlBodyParser({}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/connection', (request, response) => {
    let newTimeout = Number(request.query.set);
    let result = {};
    if (Number.isInteger(newTimeout)) {
        result.message = 'New value has been assigned';
        server.keepAliveTimeout = newTimeout;
    }
    result.keepAliveTimeout = server.keepAliveTimeout;
    response.json(result);
});

app.get('/headers', (request, response) => {
    response.set('Content-Length', '500');
    response.json({
        requestHeaders: request.headers,
        responseHeaders: response.getHeaders()
    });
});

app.get('/parameter', (request, response) => {
    let x = Number(request.query.x);
    let y = Number(request.query.y);
    parameterHandler(x, y, response);
});

app.get('/parameter/:x/:y', (request, response) => {
    let x = Number(request.params.x);
    let y = Number(request.params.y);
    parameterHandler(x, y, response);
});

app.get('/close', (request, response) => {
    const estimateCloseTime = 10;
    response.json('Server will shut down after ' + estimateCloseTime + ' seconds');
    setTimeout(() => {
        server.close();
    }, estimateCloseTime * 1000);
});

app.get('/socket', (request, response) => {
    response.json({
        client_ip: request.connection.remoteAddress,
        client_port: request.connection.remotePort,
        server_ip: request.connection.localAddress,
        server_port: request.connection.localPort
    });
});

app.get('/req-data', (request, response) => {
    let data = [];
    request.on('data', chunk => data.push(chunk));
    request.on('end', () => {
        console.log(data);
        response.end();
    });
});

const server = app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});

app.get('/resp-status', (request, response) => {
    response.statusCode = request.query.code;
    response.statusMessage = request.query.mess;
    response.end();
});

app.get('/formparameter', (request, response) => {
    response.sendFile(__dirname + '/public/formparameter-form.html');
});

app.post('/formparameter', (request, response) => {
    console.log(JSON.stringify(request.body));
    response.json(request.body);
});

app.post('/json', (request, response) => {
    let {
        __comment: comment,
        x: x,
        y: y,
        s: message,
        m: array,
        o: name
    } = request.body;
    response.json({
        __comment: 'Response. ' + comment.split('.')[1],
        x_plus_y: x + y,
        concat_s_o: message + ': ' + name.surname + ', ' + name.name,
        length_m: array.length
    });
});

app.post('/xml', (request, response) => {
    let xml = request.body;
    console.log(JSON.stringify(xml));
    response.setHeader('Content-Type', 'text/xml');
    let sum = 0;
    let concat = '';
    xml.request.x.forEach(x => sum += Number(x.$.value));
    xml.request.m.forEach(m => concat += m.$.value);
    let responseText = `<response id="33" request="${xml.request.$.id}"><sum element="x" result="${sum}"></sum><concat element="m" result="${concat}"></concat></response>`;
    response.end(responseText);
});

app.get('/files', (request, response) => {
    fs.readdir( __dirname + '/public', (err, files) => {
        if (err) {
            response.statusCode = 500;
        }
        response.setHeader('X-static-files-count', files.length);
        response.end();
    });
});

app.get('/files/:filename', (request, response) => {
    let filename = request.params.filename;
    fs.readFile(__dirname + '/public/' + filename, (err, data) => {
        if (err) {
            response.statusCode = 404;
            response.end();
        } else {
            response.sendFile(__dirname + '/public/' + filename);
        }
    })
});

app.get('/upload', (request, response) => {
    response.sendFile(__dirname + '/public/upload-form.html');
});
app.post('/upload', async (request, response) => {
    let uploadedFile = request.files.uploadedFile;
    uploadedFile.mv(__dirname + '/public/' + uploadedFile.name);
    response.end();
});

function parameterHandler(x, y, response) {
    if (Number.isInteger(x) && Number.isInteger(y)) {
        response.json({
            add: x + y,
            sub: x - y,
            mult: x * y,
            div: x / y
        });
    } else {
        response.json({message: 'Invalid Input numbers'})
    }
}