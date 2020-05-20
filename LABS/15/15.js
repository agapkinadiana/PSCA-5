let http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://Diana:DeWWsh123@bstucluster-x0qcu.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

client.connect(err => {
    if(err) console.log(err.message);
    else
        {
            console.log('MongoDB: connect successfull');
            let server = http.createServer();
            server.listen(3000, (v) => { console.log('Running') })
                .on('error', (e) => { console.log('Error: ', e.code) })
                .on('request', handler);
        }
})



let handler = (req, res) => {
    let pathUrl = url.parse(req.url, true).pathname.split('/');
    if (req.method == 'GET')
    {
        if (pathUrl[1] == 'api')
        {
            if(pathUrl[2] == 'faculties')
            {
                const collection = client.db("BSTU").collection("Faculty", (err, collection) => {
                    if(err) console.log('error: ', err);
                    else
                    {
                        collection.find({}).toArray((err, docs) => {             //find = SELECT
                            if(err) res.end(JSON.stringify('collection.find error: '+ err));
                            else {
                                res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                                res.end(JSON.stringify(docs));
                            }
                        })
                    }

                })
            }

            if(pathUrl[2] == 'pulpits')
            {
                const collection = client.db("BSTU").collection("Pulpit", (err, collection) => {
                    if(err) console.log('error: ', err);
                    else
                    {
                        collection.find({}).toArray((err, docs) => {
                            if(err) res.end(JSON.stringify('collection.find error: '+ err));
                            else {
                                res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                                res.end(JSON.stringify(docs));
                            }
                        })
                    }
                })
            }
        }
    }

    if (req.method == 'POST')
    {
        let ch = "";
        req.on('data', (data) => {
            ch += data;
        });
        req.on('end', () => {
            let db = client.db('BSTU');
            let resObj = JSON.parse(ch);
            if (pathUrl[1] == 'api') {
                if(pathUrl[2] == 'faculties')
                {
                    db.collection('Faculty').insertOne(resObj, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }

                if(pathUrl[2] == 'pulpits')
                {
                    db.collection('Pulpit').insertOne(resObj, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }
            }
        });
    }

    if (req.method == 'PUT')
    {
        let ch = "";
        req.on('data', (data) => {
            ch += data;
        });
        req.on('end', () => {
            let db = client.db('BSTU');
            let resObj = JSON.parse(ch);
            if (pathUrl[1] == 'api')
            {
                if(pathUrl[2] == 'faculties')
                {
                    db.collection('Faculty').findOneAndUpdate({faculty: resObj.faculty}, {$set: resObj}, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }

                if(pathUrl[2] == 'pulpits')
                {
                    db.collection('Pulpit').findOneAndUpdate({pulpit: resObj.pulpit}, {$set: resObj}, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }
            }
        });
    }

    if (req.method == 'DELETE')
    {
        let ch = "";
        req.on('data', (data) => {
            ch += data;
        });
        req.on('end', () => {
            let db = client.db('BSTU');
            let resObj = JSON.parse(ch);
            if (pathUrl[1] == 'api')
            {
                if(pathUrl[2] == 'faculties')
                {
                    db.collection('Faculty').deleteOne({faculty: resObj.faculty}, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }

                if(pathUrl[2] == 'pulpits')
                {
                    db.collection('Pulpit').deleteOne({pulpit: resObj.pulpit}, (err, r) => {
                        if(err) res.end(JSON.stringify('collection.find error: '+ err));
                        else
                        {
                            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                            res.end(JSON.stringify(resObj));
                        }
                    });
                }
            }
        });
    }
}