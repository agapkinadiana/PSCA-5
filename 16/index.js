const express = require('express');
const graphqlHTTP = require('express-graphql');

const config = require('./config').http;
const schema = require('./schema');
const app = express();

app.use('/', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(config.port, () => {
    console.log(`Listening to http://${config.host}:${config.port}`);
});

// const Db = require('./db/Db');
// let db = new Db();
// console.log(JSON.stringify(db.getAll('Faculty'), null, '  '));
