const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config').server;
const handler = require('./api/handler');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/api/:objects', handler.getAllHandler);
app.post('/api/:objects', handler.createNewHandler);
app.put('/api/:objects', handler.updateHandler);
app.delete('/api/:objects/:id', handler.deleteHandler);

app.listen(config.port, () => {
    console.log(`Listening to http://localhost:${config.port}`);
});
