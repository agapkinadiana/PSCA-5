const http = require('http');

let options = {
    hostname : 'localhost',
    port : 5000,
    path : '/09-01', 
    method : 'GET'
}

const req = http.request(options, (response) => {
    console.log('method: ' + req.method);
    console.log('responseCode: ' + response.statusCode);
    console.log('responseMessage: ' + response.statusMessage);
    console.log('IP: ' + response.socket.remoteAdress);
    console.log('port: ' + response.socket.remotePort);
    console.log('headers: ' + response.headers);

    let data = '';
    
    response.on('data', chunk => {
        data += chunk;
    });
    response.on('end', () => {
        console.log(data);
    });

});

req.end();