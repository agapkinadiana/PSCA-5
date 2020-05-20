const { createServer } = require('http');
const { readFileSync } = require('fs');
const { graphql, buildSchema } = require('graphql');

const config = require('./config').http;
const resolvers = require('./resolvers');
const schema = buildSchema(readFileSync('./schemas/schema.gql').toString());
const Db = require('./db/Db');

const context = new Db();


const server = createServer((request, response) => {
    let body = '';
    request.on('data', chunk => body += chunk);
    request.on('end', () => {

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');

        if (request.url === '/' && request.method === 'POST') {
            let graphqlRequest = '';
            try {
                graphqlRequest = JSON.parse(body);
                if (graphqlRequest.query) {
                    graphql(schema, graphqlRequest.query, resolvers, context, graphqlRequest.variables)
                        .then(result => {
                            if (result.errors) {
                                response.statusCode = 400;
                            }
                            response.end(JSON.stringify(result, null, '  '));
                        }).catch(err => {
                            response.statusCode = 500;
                            response.end(JSON.stringify({error: err}, null, '  '));
                        });
                } else {
                    response.statusCode = 400;
                    response.end();
                }
            } catch (err) {
                response.statusCode = 500;
                response.end(JSON.stringify({error: err}, null, '  '));
            }
        } else {
            response.statusCode = 404;
            response.end();
        }
    });
});

server.listen(config.port, config.host, () => {
    console.log(`Listening to http://${config.host}:${config.port}`);
});


/*
* Sample requests:
*
* Get faculties
* {
*   "query": "query { getFaculties {Faculty_Id, Faculty_Name, Pulpits {Pulpit_Id, Pulpit_Name}} }"
* }
*
* Add Faculty
* {
*   "query": "mutation($faculty: NewFaculty!) { setFaculty(faculty: $faculty) {Faculty_Id, Faculty_Name} }",
*   "variables": {
*     "faculty": {
*       "facultyName": "New One"
*     }
*   }
* }
*
* Delete Subject
* {
*   "query": "mutation($id: Int!) { delSubject(id: $id) {Subject_Id, Subject_Name} }",
*   "variables": {
*     "id": 5
*   }
* }
*
* */
