const express = require('express');
const bodyParser = require('body-parser');
const xmlBodyParser = require('express-xml-bodyparser');
const fileUpload = require('express-fileupload');

const config = require('./config');

const app = express();

app.use(fileUpload({createParentPath: true}));
app.use(xmlBodyParser({}));
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.statusCode = '201';
    response.json({data: "hi there"});
});
app.get('/x-and-y', (request, response) => {
    response.json({result: 'success: ' + request.query.x + request.query.y});
});
app.post('/x-y-s', (request, response) => {
    response.json({result: request.body.s + ': ' + request.body.x + request.body.y});
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
    response.setHeader('Content-Type', 'text/xml');
    let sum = 0;
    let concat = '';
    xml.request.x.forEach(x => sum += Number(x.$.value));
    xml.request.m.forEach(m => concat += m.$.value);
    let responseText = `<response id="33" request="${xml.request.$.id}"><sum element="x" result="${sum}"></sum><concat element="m" result="${concat}"></concat></response>`;
    response.end(responseText);
});
app.post('/text', (request, response) => {
    response.end(request.files.textFile.name);
});
app.post('/img', (request, response) => {
    response.end(request.files.imgFile.name);
});
app.post('/sendfile', (request, response) => {
    response.sendFile(__dirname + '/MyFile.txt');
});

app.listen(config.server.port, () => {
    const URL = `http://localhost:${config.server.port}`;
    console.log('Listening on ' + URL);
});