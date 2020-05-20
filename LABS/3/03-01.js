var http = require('http');

const states = ['norm', 'stop', 'test', 'idle']
var currentState = states[0];

http.createServer((request, response) => {
  response.writeHead(200, {'Content-type': 'text/html'});
  response.end(`<h1>${currentState}</h1>`);
}).listen(3000);

console.log('Server running at http://127.0.0.1:3000');

let chunk = null;
let state = "norm";
process.stdout.write(state + " -> ");

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", () => {
  while ((chunk = process.stdin.read()) != null) {
    if (chunk.trim() == "exit") {
      process.exit(0);
    } else if (chunk.trim() == "norm") {
      state = "norm";
    } else if (chunk.trim() == "test") {
      state = "test";
    } else if (chunk.trim() == "idle") {
      state = "idle";
    }
    process.stdout.write(state + " -> ");
  }
});