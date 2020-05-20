const express = require('express');
const State = require('./State');
const Factorial = require('./Factorial');

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const state = new State();

app.get('/', (request, response) => {
    response.end(`${state.getState().currentState}`);
});

app.get('/fact-fetch', (request, response) => {
    let page = __dirname + '/factorial-fetch.html';
    response.sendFile(page);
});

app.get('/fact', (request, response) => {
    let k = request.query.k;
    response.json({k: k, fact: Factorial.factorial(k)});
});

app.get('/fact-nexttick', (request, response) => {
    let k = request.query.k;
    let factorial = new Factorial(process.nextTick);
    factorial.factorialAsync(k, (err, result) => {
        response.json({k: k, fact: result});
    });
        
});

app.get('/fact-setimmediate', (request, response) => {
    let k = request.query.k;
    let factorial = new Factorial(setImmediate);
    factorial.factorialAsync(k, (err, result) => {
        response.json({k: k, fact: result});
    });
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
    state.printState();
});

state.listen();