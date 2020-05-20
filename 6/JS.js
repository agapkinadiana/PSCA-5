const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8000;
const HOST = 'localhost';

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/HTML.html');
});

app.post('/mail', (request, response) => {
    let {
        from: from,
        to: to,
        message: message
    } = request.body;
    require('./EmailSender')(from, to, message);
    response.end();
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});