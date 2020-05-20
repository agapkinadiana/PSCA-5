var http = require('http');
var url = require ('url');
let parseString= require('xml2js').parseString;
let xmlbuilder= require('xmlbuilder');
const {parse} = require('querystring');

let http_handler=(req,res)=> {
	if (req.method == 'POST') {
		if (url.parse(req.url).pathname === '/XML') {
			let sumx = 0;
			let resultm = '';
			let id = '';
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString();
			});
			req.on('end', () => {
					console.log(body);
					parseString(body, function (err, result) {
						id = result.request.$.id;
						console.log(id);
						result.request.m.map((e, i) => {
							resultm += e.$.value;
						});
						result.request.x.map((e, i) => {
							console.log(e.$.value);
							sumx += (+e.$.value);
						});
					});
					let result = xmlbuilder.create('response').att('id', id);
					result.ele('sum', {element: "x", result: sumx});
					result.ele('concat', {element: "m", result: resultm});
					res.writeHead(200, {'Content-Type': 'application/xml'});
					res.end(result.toString());
				}
				, function (err, reply) {
					console.log(err && err.stack);
					console.dir(reply);
				});


		}
	}
}

var server=http.createServer(function (req, res){
    http_handler(req,res);
}).listen(5000);