const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const config = require('./../config').db;

let client;
class Db {
    constructor() {
        client = new MongoClient(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        client = client.connect().then(this.getConnection);
    }

    getConnection(connection) {
        return connection.db("BSTU");
    }

    getAll(tableName) {
        return client
            .then(db => {
                return db.collection(tableName).find({}).toArray();
            });
    }

    getOne(tableName, fields) {
        return client
            .then(db => {
                return db.collection(tableName).findOne(fields);
            }).then(record => {
                if (!record) {
                    throw 'There are no such records';
                }
                return record;
            });
    }

    insertOne(tableName, fields) {
        return client
            .then(async db => {
                await db.collection(tableName).insertOne(fields);
            }).then(() => this.getOne(tableName, fields));
    }

    updateOne(tableName, id, fields) {
        return client
            .then(async db => {
                if (!id) {
                    throw "There are no record id has been provided";
                }
                await db.collection(tableName).updateOne({_id: ObjectId(id)}, {$set: fields});
                return db;
            }).then(db => {
                return db.collection(tableName).findOne(fields);
            });
    }

    deleteOne(tableName, id) {
        return client
            .then(async db => {
                if (!id) {
                    throw 'There are no Id value has been provided. Example: /api/instances/:id';
                }
                let removedRecord = await this.getOne(tableName, {_id: ObjectId(id)});
                await db.collection(tableName).deleteOne({_id: ObjectId(id)});
                return removedRecord;
            });
    }
}

module.exports = Db;
