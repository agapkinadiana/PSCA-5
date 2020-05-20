const RPCWebSocket = require('rpc-websockets').Server;
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const students = require('./data/student-list');

const PORT = 8000;
const WS_PORT = 8001;
const HOST = 'localhost';
const DATA_FILE_PATH = __dirname +  '/data/student-list.json';
const BACKUP_DIR_PATH = __dirname +  '/data/backup/';

const socket = new RPCWebSocket({
    port: WS_PORT,
    host: HOST,
    path: '/'
});
socket.event('changed');

const app = express();
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.json(students);
});
app.post('/', (request, response) => {
    let {
        id: id,
        name: name,
        birth: birth,
        speciality: speciality
    } = request.body;
    if (students.find(s => s.id == id)) {
        response.statusCode = 400;
        response.json({error: 'Such student already exists'});
    } else {
        let student = {id: id, name: name, birth: birth, speciality: speciality};
        students.push(student);
        fs.writeFile(DATA_FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        socket.emit('changed');
        response.json(student);
    }
});
app.put('/', (request, response) => {
    let {
        id: id,
        name: name,
        birth: birth,
        speciality: speciality
    } = request.body;
    let studentIndex = students.findIndex(s => s.id == id);
    if (studentIndex !== -1) {
        let newStudent = {id: id, name: name, birth: birth, speciality: speciality};
        let oldStudent = students[studentIndex];
        Object.keys(oldStudent).forEach(field => {
            if (newStudent[field] && oldStudent[field] !== newStudent[field]) {
                oldStudent[field] = newStudent[field];
            }
        });
        fs.writeFile(DATA_FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        socket.emit('changed');
        response.json(oldStudent);
    } else {
        response.statusCode = 401;
        response.json({error: 'No such student with provided id was found'});
    }
});

app.get('/:id', (request, response) => {
    if (request.params.id === 'backup') {
        fs.readdir(BACKUP_DIR_PATH, ((err, files) => {
            let list = [];
            files.forEach(async file => {
                list.push(JSON.parse(fs.readFileSync(BACKUP_DIR_PATH + file).toString()));
            });
            response.json(list);
        }));
        return;
    }
    let student = students.find(s => s.id == request.params.id);
    if (student) {
        response.json(student);
    } else {
        response.statusCode = 404;
        response.end();
    }
});
app.delete('/:id', (request, response) => {
    let student = students.find(s => s.id == request.params.id);
    if (student) {
        students.splice(students.findIndex(s => s.id == request.params.id), 1);
        fs.writeFile(DATA_FILE_PATH, JSON.stringify(students, null, '  '), () => {});
        response.json(student);
    } else {
        response.statusCode = 404;
        response.end();
    }
});

/*app.get('/backup', (request, response) => {
    fs.readdir(BACKUP_DIR_PATH, ((err, files) => {
        let list = [];
        files.forEach(async file => {
            list.push(JSON.parse(fs.readFileSync(BACKUP_DIR_PATH + file).toString()));
        });
        response.json(list);
    }));
});*/
app.post('/backup', (request, response) => {
    const BACKUP_DELAY = 2000;
    const date = new Date();
    let backupFilePath = BACKUP_DIR_PATH
        + date.getFullYear() + '-'
        + date.getMonth() + '-'
        + date.getDay() + '-'
        + date.getHours() + '-'
        + date.getMinutes() + '-'
        + date.getSeconds() + '-'
        + 'student-list.json';
    setTimeout(() => {
        fs.copyFile(DATA_FILE_PATH, backupFilePath, err => {
            if (err) {
                response.statusCode = 500;
                response.json({error: err.message});
            }
            response.end();
        });
    }, BACKUP_DELAY);
});
app.delete('/backup/:date', (request, response) => {
    fs.readdir(BACKUP_DIR_PATH, (err, files) => {
        if (err) {
            response.statusCode = 500;
            response.json({error: err.message});
            throw err;
        }
        let providedBackupDate = request.params.date;
        let year = '', month = '', day = '';
        for (let i = 0; i < providedBackupDate.length; i++) {
            if (i < 4) {
                year += providedBackupDate.charAt(i);
            } else if (i < 6) {
                month += providedBackupDate.charAt(i);
            } else {
                day += providedBackupDate.charAt(i);
            }
        }
        providedBackupDate = new Date(Number(year), Number(month), Number(day));
        files.forEach(file => {
            let dateParams = file.split('-').splice(0, 6);
            let backupDate = new Date(
                Number(dateParams[0]),
                Number(dateParams[1]),
                Number(dateParams[2]),
                Number(dateParams[3]),
                Number(dateParams[4]),
                Number(dateParams[5])
            );
            if (providedBackupDate > backupDate) {
                fs.unlink(BACKUP_DIR_PATH + file, err => {
                    if (err) {
                        response.statusCode = 500;
                        response.body = JSON.stringify({error: err.message});
                        throw err;
                    }
                })
            }
        });
        response.end();
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Listening to http://${HOST}:${PORT}`);
});