const fs = require('fs');
let rs = require('fs').createReadStream('./file14.txt');
let ws = require('fs').createWriteStream('./file15.txt');
rs.pipe(ws);


//console.log(rs.pipe(ws));