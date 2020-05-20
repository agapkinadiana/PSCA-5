const http = require('http');
const fs = require('fs');

const path = '/09-07';
const file = fs.createWriteStream('./newPic.jpeg');

let options = {
    hostname : 'localhost',
    port : 5000,
    path : path, 
    method : 'GET',
}

const req = http.request(options, (response) => {
    response.pipe(file);
});

req.end();