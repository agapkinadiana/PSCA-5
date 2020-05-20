const http = require ('http');
const url = require ('url');

let handler = (request, response) => {
    if(request.method ==='GET'){
        let result = '';
        let p = url.parse(request.url, true);
        let q = url.parse(request.url, true).query;

        if (!(p.pathname =='/favicon.ico')) {
            result = `href: ${p.href}<br/>` +
                `path: ${p.path}<br/>` +
                `pathname: ${p.pathname}<br/>` +
                `search: ${p.search}<br/>`;
            for (key in q) {
                result += `${key} = ${q[key]}<br/>`;
            }
        }

        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
        response.write('<h3>GET-parameters</h3>');
        response.end(result);
    }
}

let server = http.createServer();
server.listen(3000, (v) => {console.log('run')})
        .on("error", (e)=>{console.log("Server error: "+e.code)})
        .on("request", handler);