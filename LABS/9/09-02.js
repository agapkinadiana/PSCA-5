const http = require('http');
const query = require('querystring');

let params = query.stringify({x: 200, y: 100});  //convert to query string
let path = '/09-02?' + params;

let options = {
    hostname : 'localhost',
    port : 5000,
    path : path, 
    method : 'GET'
}

const req = http.request(options, (response) => {
    console.log('method: ' + req.method);
    console.log('responseCode: ' + response.statusCode);
    console.log('responseMessage: ' + response.statusMessage);

    let data = '';
    
    response.on('data', chunk => {
        data += chunk;
    });
    response.on('end', () => {
        console.log(data);
    });

});

req.end();