const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const db = new DataBase(DataBase.films());

app.use(bodyParser.json());
app.use(express.static('./public'));

db.on('get', async (request, response) => {
    await response.json(await db.getRows());
});
db.on('post', async (request, response) => {
    let newObject = {
        title: title,
        producer: producer,
        genre: genre,
        production: production,
        duration: duration,
        year_of_issue: year_of_issue
    } = request.body;
    await response.json(await db.addRow(newObject));
});
db.on('put', async (request, response) => {
    let object = {
        id: id,
        title: title,
        producer: producer,
        genre: genre,
        production: production,
        duration: duration,
        year_of_issue: year_of_issue
    } = request.body;
    await response.json(await db.updateRow(object));
});
db.on('delete', async (request, response) => {
    await response.json(await db.removeRow(request.query.id));
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/HTML.html');
});
app.get('/api/db', (request, response) => {
    db.emit('get', request, response);
});
app.post('/api/db', (request, response) => {
    db.emit('post', request, response);
});
app.put('/api/db', (request, response) => {
    db.emit('put', request, response);
});
app.delete('/api/db', (request, response) => {
    db.emit('delete', request, response);
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});