const Db = require('./../db/Db');

const config = require('./../config').objects;
const db = new Db();

module.exports = {

    getAllHandler(request, response) {
        const object = config[request.params.objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.getAll(object).then(records => {
            response.json(records.recordset);
        }).catch(error => {
            response.statusCode = 400;
            response.json({error: String(error)});
        });
    },

    createNewHandler(request, response) {
        const object = config[request.params.objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.insertOne(object, request.body)
            .then(() => db.getOne(object, request.body))
            .then(record => {
                response.json(record.recordset[0]);
            }).catch(error => {
                response.statusCode = 400;
                response.json({error: String(error)});
            });
    },

    updateHandler(request, response) {
        const object = config[request.params.objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.updateOne(object, request.body)
            .then(() => db.getOne(object, request.body))
            .then(record => {
                response.json(record.recordset[0]);
            }).catch(error => {
                response.statusCode = 400;
                response.json({error: String(error)});
            });
    },

    deleteHandler(request, response) {
        const object = config[request.params.objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        const fields = new Map();
        fields[object + '_Id'] = request.params.id;
        db.getOne(object, fields).then(record => {
            return db.deleteOne(object, request.params.id)
                .then(() => response.json(record.recordset[0]));
        }).catch(error => {
            response.statusCode = 400;
            response.json({error: String(error)});
        });
    }
};
