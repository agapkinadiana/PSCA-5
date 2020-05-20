const http = require('http');

let reqJsonObj = {
	__comment: "request 09-04",
	x: 1,
	y: 2,
	s: "Message",
	m: ["a", "b", "c"],
	o: {"surname": "Agapkina", "name": "Diana"}
}

let data = JSON.stringify(reqJsonObj);
let path = '/09-04';

let options = {
    hostname : 'localhost',
    port : 5000,
    path : path, 
    method : 'POST'
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
        resJsonObj = JSON.parse(data);
        console.log(resJsonObj);
    });

});

req.write(data);
req.end();

