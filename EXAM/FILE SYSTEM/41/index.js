const fs = require('fs');

let k = 5;                                            //количество записываемых чисел
let sizeInt32LE = 4;                                  //размер Int32
let buff = Buffer.allocUnsafe(sizeInt32LE * 5); //выделить 40 байт без инициализации

/*fs.open('./files/test.dat', 'w', (e, file) => {
    for (let i = 0; i < k; i++)
        buff.writeInt32LE(i, i * sizeInt32LE);
    fs.appendFile(file, buff, e => {
        if (e) console.log('Error: ', e);
        console.log('Complete!:)')
    })
})*/

fs.open('./files/test.dat', 'r', (e, buf) => {
    fs.readFile('./files/test.dat', (e, buf) => {
        if (e) console.log('Error: ', e);
        else {
            let k = buf.length/sizeInt32LE;  //количество Int32-чисел
            let m = [];                      //массив для заполнения
            for (let i = 0; i < k; i++) {
                m.push(buf.readInt32LE(i * sizeInt32LE));
            }
            console.log('m = ', m);
        }
    })
})