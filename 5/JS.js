const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');
const CliCommand = require('./ss/CliCommand');

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const db = new DataBase(DataBase.films());
const command = new CliCommand();

app.use(bodyParser.json());
app.use(express.static('./public'));

db.on('GET', async (request, response) => {
    await response.json(await db.getRows());
});
db.on('POST', async (request, response) => {
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
db.on('PUT', async (request, response) => {
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
db.on('DELETE', async (request, response) => {
    await response.json(await db.removeRow(request.query.id));
});

db.on('COMMIT', async () => db.commit());

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/HTML.html');
});
app.use('/api/db', (request, response) => {
    db.emit(request.method, request, response);
});
app.get('/api/ss', (request, response) => {
    response.json(db.logs);
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    command.print('> Listening on ' + URL + '\n');
    command.listen(db);
});