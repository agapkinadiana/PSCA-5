const fs = require('fs');

/*let buf01 = Buffer.from([1,2,3,4,5,6,7,8,255,254]);
fs.writeFile('./file01.dat', buf01, (e)=>{
    if(e) console.log('Error: ', e);
    console.log('- 1 -------------------------------')
    console.log('buf01 = ', buf01);
    console.log('buf01.toString() = ', buf01.toString());
    let x = 0;
    for (const s of buf01.values()) x+=s;
    console.log('buf01.values() = ', buf01.values(), x);
    console.log('buf01.toJSON() = ', buf01.toJSON(buf01));
});
let buf03 = Buffer.from('aaa bbb ccc ААА ааа БББ 666', 'utf8');
fs.writeFile('./file03.dat', buf03, (e)=>{
    if(e) console.log('Error: ', e);
    console.log('- 3 -------------------------------')
    console.log('buf03 = ', buf03);
    console.log('buf03.toString() = ', buf03.toString('utf8'));
    let x = 0;
    for (const s of buf03.values()) x+=s;
    console.log('buf03.values() = ', buf03.values());
    console.log('buf03.toJSON() = ', buf03.toJSON(buf03));
});
*/

buffer = new Buffer.from("some content\n");

/*fs.open('./file01.dat', 'w', function(err, fd) {
    if (err) {
        throw 'error opening file: ' + err;
    }
    fs.write(fd, buffer, 0, buffer.length, null, function(err) {
        if (err) throw 'error writing file: ' + err;
        fs.close(fd, function() {
            console.log('file written');
        })
    });
});*/

/*fs.open('./file01.dat', 'r', function(err, fd) {
    fs.fstat(fd, function (err, stats) {   //returns information about an open file
        var bufferSize = stats.size,
            chunkSize = 512,
            buffer = new Buffer(bufferSize),
            bytesRead = 0;
        console.log(stats.size);
        while (bytesRead < bufferSize) {
            if ((bytesRead + chunkSize) > bufferSize) {
                chunkSize = (bufferSize - bytesRead);
            }
            fs.read(fd, buffer, bytesRead, chunkSize, bytesRead, function (err) {
                if (err) throw 'error writing file: ' + err;
                fs.close(fd, function () {
                    console.log('file written');
                })
                bytesRead += chunkSize;
                console.log(buffer.toString('utf8', 0, bufferSize));
                //fs.close(fd);
            });
        }
    });
})*/

var buf = new Buffer.allocUnsafe(1024);

console.log("Going to open an existing file");
fs.open('./file01.dat', 'r+', function(err, fd) {
    if (err) {
        return console.error(err);
    }
    console.log("File opened successfully!");
    console.log("Going to read the file");

    fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
        if (err){
            console.log(err);
        }

        // Print only read bytes to avoid junk.
        if(bytes > 0){
            console.log(buf.slice(0, bytes).toString());
        }

        // Close the opened file.
        fs.close(fd, function(err){
            if (err){
                console.log(err);
            }
            console.log("File closed successfully.");
        });
    });
});