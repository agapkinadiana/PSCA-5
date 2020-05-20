var http = require('http');
var url = require('url');
var fs = require('fs');

const rpcWSS = require('rpc-websockets').Server;

const wsserver = new rpcWSS ({
    port:4000,
    host:"localhost"
});
wsserver.event('Change file');

let isStudentList = (fn) => { let reg = new RegExp("[0-9]+_StudentList.json"); return reg.test(fn);}

let writeHTTP405 = (res) => {
	res.statusCode = 405;
	res.statusMessage = 'Use another method';
	res.end('Use another method');
}
let http_handler = (req,res) => {
    if (req.method == 'GET') {
        if (url.parse(req.url).pathname === '/') {
            let result = '';
            fs.readFile('./Studentlist.json', (e, data) => {
                if (e) console.log('Ошибка: ', e);
                else {
                    result += data.toString('utf-8');
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(result);
                }
            });
        } else if (url.parse(req.url).pathname.search('\/[1-9]+') != (-1))   //  \ - буквальная инициализация //get by id
        {
            let result = '';
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let x =+ r[1];
            fs.readFile('./Studentlist.json', (e, data) => {
                if (e) console.log('Ошибка: ', e);
                else {
                    let os = JSON.parse(data);
                    os.forEach(element => {
                        if (element.id == x) {
                            console.log(element);
                            result = {
                                id: element.id,
                                name: element.name,
                                bday: element.bday,
                                specility: element.specility
                            };
                            console.log(result);
                        }
                    });
                    if (result != '') {
                        console.log(result);
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(result));
                    } else {
                        let error = '{"error":1,"message":"Студент для получения не существует"}';
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(error);
                    }
                }
            });
        } else if (url.parse(req.url).pathname === '/backup') {
            let result = '';
            fs.readdirSync('./').map(fileName => {  // creates a new array with the result of calling the specified
                                                        // function for each element of the array.
                console.log(fileName);
                if (isStudentList(fileName)) {
                    console.log(fileName);
                    result += '{"filename":"' + fileName + '"}; ';
                }
            });
            console.log(result);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(result);
        } else res.end('Nothing on this pages');
    } else if (req.method == 'POST') {
        if (url.parse(req.url).pathname === '/') {
            let body = '';
            let result2 = '[';
            let x = 0;
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let result = '';
                console.log("Enter in POST /");
                x = JSON.parse(body).id;
                fs.readFile('./Studentlist.json', (e, data) => {
                    if (e) console.log('Ошибка: ', e);
                    else {
                        console.log("Start read");
                        let os = JSON.parse(data);
                        console.log(x);
                        os.forEach(element => {
                            result2 += `{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                            console.log(result2);
                            if (element.id == x) {
                                result += '1';
                            }
                        });
                        if (result == '') {
                            result2 += body + ']';
                            fs.writeFile('./Studentlist.json', result2, (e) => {
                                if (e) throw e;
                                console.log("Запись успешно завершена");
                            });
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(body);
                        } else {
                            let error = '{"error":2,"message":"Студент уже существует"}';
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(error);
                        }
                    }
                });
            });
        } else if (url.parse(req.url).pathname === '/backup') {
            setTimeout(() => {
                let date = new Date();
                let name = "";
                name += date.getFullYear();
                name += (date.getMonth() + 1);
                name += date.getDate();
                name += (date.getHours() - 1);
                name += date.getMinutes();
                name += "_StudentList.json";
                console.log(name);
                fs.copyFile("./StudentList.json", "./" + name, (e) => {
                    if (e) {
                        console.log("Ошибка", e);
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.end('Ошибка создания бэкапа');
                    } else {
                        fs.watch(`./${name}`, (event, f) => {
                            if (f) wsserver.emit("Change file");
                        })
                        console.log("Файл успешно скопирован");
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        res.end('Файл скопирован');
                    }
                });
            }, 2000);
        } else res.end('Nothing on this pages');
    } else if (req.method == 'PUT') {
        if (url.parse(req.url).pathname === '/') {
            let body = '';
            let k = 0;
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let result = '[';
                let x = JSON.parse(body).id;
                console.log(x);
                fs.readFile('./Studentlist.json', (e, data) => {
                    if (e) console.log('Ошибка: ', e);
                    else {
                        let os = JSON.parse(data);
                        os.forEach(element => {
                            console.log(result);
                            if (x == element.id) {
                                result += body + ',';
                                k = 1;
                            } else result += `{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                        });
                    }
                    if (k == 1) {
                        result = result.substring(0, result.length - 1);
                        result += ']';
                        fs.writeFile('./Studentlist.json', result, (e) => {
                            if (e) throw e;
                            console.log("Запись успешно завершена");
                        });
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(body);
                    } else {
                        let error = '{"error":3,"message":"Студент для изменения не существует"}';
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(error);
                    }
                });
            });
        }
    } else if (req.method == 'DELETE') {
        if (url.parse(req.url).pathname.search('\/backup\/[1-9]+') != (-1)) {
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let x = r[2];
            fs.readdirSync('./').map(fileName => {
                console.log(fileName);
                if (isStudentList(fileName)) {
                    let result = fileName.split('_')[0];
                    console.log(result);
                    if (result > x) {
                        fs.unlink("./" + fileName, (e) => {
                            if (e) console.log("Ошибка: ", e);
                        })
                    }
                }
            });
            res.end("Удаление завершено");
        } else if (url.parse(req.url).pathname.search('\/[1-9]+') != (-1)) {  //delete student by id
            let k = 0;
            let body = "";
            let p = url.parse(req.url, true);
            let r = decodeURI(p.pathname).split('/');
            let x = +r[1];
            let result = '[';
            console.log(x);
            fs.readFile('./Studentlist.json', (e, data) => {
                if (e) console.log('Ошибка: ', e);
                else {
                    let os = JSON.parse(data);
                    os.forEach(element => {
                        console.log(result);
                        if (x == element.id) {
                            body += `{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                            k = 1;
                        } else result += `{"id":${element.id}, "name":"${element.name}","bday":"${element.bday}","specility":"${element.specility}"},`;
                    });
                }
                if (k == 1) {
                    result = result.substring(0, result.length - 1);
                    result += ']';
                    fs.writeFile('./Studentlist.json', result, (e) => {
                        if (e) throw e;
                        console.log("Удаление успешно завершено");
                    });
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(body);
                } else {
                    let error = '{"error":4,"message":"Студент для удаления не существует"}';
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(error);
                }
            });
        }
    } else writeHTTP405(res);
}
var server = http.createServer( (req, res) => {
    fs.watch("./StudentList.json", (event, f) => {
        if (f) wsserver.emit("Change file");
    })
    http_handler(req, res);
}).listen(5000);

//let server = http.createServer();
//server.listen(5000).on('request',http_handler);