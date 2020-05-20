const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
//const dns = require('dns');

const config = require('./config');

let service = axios.create({
    baseURL: `http://${config.server.host}:${config.server.port}`,
    responseType: "application/json"
});

main();

function main() {
    task1()
        .then(task2)
        .then(task3)
        .then(task4)
        .then(task5)
        .then(task6)
        .then(task7)
        .then(task8)
}

async function task1() {
    await service.get('/')
        .then(response => {
            console.log('Response status: ' + response.statusText);
            console.log('Response status code: ' + response.status);

            /*dns.resolve4(config.server.host, (err, addresses) => {
                console.log('IP address of the remote server: ' + addresses[0]);
                console.log('Port of the remote server: ' + config.server.port);
            });*/
            console.log('IP address of the remote server: ' + '127.0.0.1');
            console.log('Port of the remote server: ' + config.server.port);
            console.log('Body: ' + JSON.stringify(response.data));
        });
}

async function task2() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    await service.get('/x-and-y?x=2&y=3')
        .then(response => {
            console.log('Status: ' + response.status + '. ' + response.statusText);
            console.log('Result: ' + JSON.stringify(response.data));
        });
}

async function task3() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    await service.post('/x-y-s', {x: 2, y: 3, s: "aaaaaaaa"})
        .then(response => {
            console.log('Status: ' + response.status + '. ' + response.statusText);
            console.log('Result: ' + JSON.stringify(response.data));
        });
}

async function task4() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    await service.post('/json', {
        __comment: "comment",
        x: 1,
        y: 2,
        s: "message",
        m: ["a", "b"],
        o: {surname: "Agapkina", name: "Diana"}
    }).then(response => {
            console.log('Status: ' + response.status + '. ' + response.statusText);
            console.log('Result: ' + JSON.stringify(response.data));
        });
}

async function task5() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    await service.post('/xml', fs.readFileSync('./xmlSample.xml'), {
        headers: {'Content-Type': 'application/xml'}
    }).then(response => {
        console.log('Status: ' + response.status + '. ' + response.statusText);
        console.log('Result: ' + JSON.stringify(response.data));
    });
}

async function task6() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    const formData = new FormData();
    formData.append(
        'textFile',
        fs.createReadStream(__dirname + '/MyFile.txt'),
        {knownLength: fs.statSync(__dirname + '/MyFile.txt').size}
    );

    await service.post('/text', formData, {
        headers: {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        }
    }).then(response => {
        console.log('Status: ' + response.status + '. ' + response.statusText);
        console.log('Result: ' + JSON.stringify(response.data));
    });
}

async function task7() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    const formData = new FormData();
    formData.append(
        'imgFile',
        fs.createReadStream(__dirname + '/MyFile.jpg'),
        {knownLength: fs.statSync(__dirname + '/MyFile.jpg').size}
    );

    await service.post('/img', formData, {
        headers: {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync()
        }
    }).then(response => {
        console.log('Status: ' + response.status + '. ' + response.statusText);
        console.log('Result: ' + JSON.stringify(response.data));
    });
}

async function task8() {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~\n');
    await service.post('/sendfile')
        .then(response => {
            console.log('Status: ' + response.status + '. ' + response.statusText);
            console.log('Result: ' + JSON.stringify(response.data));
        });
}