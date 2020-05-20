const express = require('express');
const bodyParser = require('body-parser');
const publicHandler = require('./public-handler');

const HOST = 'localhost';
const PORT = 8000;

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(publicHandler.getHandler);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/HTML.html');
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});