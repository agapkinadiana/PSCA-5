const Readable  = require('stream').Readable;
const Writable = require('stream').Writable;
let rs = new Readable();
rs.push('\neeeee\n');
rs.push('aaaaa\n');
rs.push('vvvvv\n');
rs.push(null); /*end data*/

rs.on('readable', ()=>{
    let chunk;
    while (null!=(chunk = rs.read())){
        console.log('Отправлено' + chunk.length+ 'байтoв:' + chunk);
    }
})

let ws = Writable();
ws._write=(chunk, enc, next)=>{
    console.log('_write:', chunk.toString());
    next();
};
process.stdin.on('data', (chunk)=>{
    ws.write(chunk);
});