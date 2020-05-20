const fs = require('fs');

const RESERVED_URI = [
    '/'
];

module.exports = {
    getHandler : function(request, response, next) {
        if (request.method === 'GET') {

            if (RESERVED_URI.includes(request.url)) {
                next();
                return;
            }

            let filePath = __dirname + '/public' + request.url;
            searchFile(filePath, response);
        } else {
            throwFail(response, 405);
        }
    }
};

function searchFile(filePath, response) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            throwFail(response, 404);
            return;
        }
        if (stats.isFile()) {
            response.sendFile(filePath);
        } else {
            throwFail(response, 404);
        }
    });
}

function throwFail(response, code) {
    response.statusCode = code;
    response.end();
}