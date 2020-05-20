const fs = require('fs');

/*fs.open('./files/test.txt', 'w', (e,file) => {
    if (e) console.log('Error: ' + e);
    console.log('file created!');
})*/

/*let str1 = 'hello';
fs.writeFile('./files/test.txt', str1, (e) => {
    if (e) console.log('Error: ' + e);
    console.log('writing to file completed successfully!');
})


let str2 = ' world';
fs.appendFile('./files/test.txt', str2, (e) => {
    if (e) console.log('Error: ' + e);
    console.log('writing to the end of file completed successfully!');
})*/

//fs.writeFileSync('./files/hello.txt', 'diiii!');

/*fs.readFile('./files/test.txt', (e, data) => {
    if (e) console.log('Error: ' + e);
    else console.log('data: ', data.toString('utf-8'));
})*/

/*let contents = fs.readFileSync('./files/test.txt', 'utf8');
console.log(contents);*/

/*fs.unlink('./files/test.txt', (e) => {
    if (e) console.log('Error: ' + e);
    console.log('file deleted!');
});*/

/*fs.rename('./files/test.txt', './files/test2.txt', (e) => {
    if (e) console.log('Error: ' + e);
    console.log('file renamed!');
})*/

/*fs.copyFile('./files/test2.txt', './files/test.txt', (e) => {
    if (e) console.log('Error: ' + e);
    console.log('file copied!');
})*/

/*fs.exists('./files/test2.txt', (exists) => {
    if(exists) console.log('file exists');
    else console.log('file does not exists!');
});*/

/*const filename = './files/test.txt';
try{
    fs.watch(filename,(event ,f)=>{
        if(f) console.log(`file:${f}, event=${event}`);
    });
}
catch (e) {
    console.log('Error: ' + e);
}*/