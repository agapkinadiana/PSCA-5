const Db = require('./../db/Db');

const config = require('./../config').object_mapping;
const db = new Db();

module.exports = {

    getAllHandler(request, response) {
        const object = config[request.params.objects];
        if (!object) {
            response.statusCode = 404;
            response.end();
            return;
        }
        db.getAll(object)
            .then(records => response.json(records))
            .catch(error => {
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
            .then(record => response.json(record))
            .catch(error => {
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
        let id = request.body._id.repeat(1);
        delete request.body._id;

        db.updateOne(object, id, request.body)
            .then(record => response.json(record))
            .catch(error => {
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
        db.deleteOne(object, request.params.id)
            .then(record => response.json(record))
            .catch(error => {
                response.statusCode = 400;
                response.json({error: String(error)});
            });
    }
};
