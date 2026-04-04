const fs = require('fs');

const documento = fs.readFileSync('pruebafs.txt', 'utf-8');
console.log(documento)
console.log(typeof(documento))

const nuevaLinea = '\nVoy a agregar uno más.';
fs.appendFileSync('pruebafs.txt', nuevaLinea);

console.log(fs.readFileSync('pruebafs.txt', 'utf-8'))

// ELIMNAR ARCHIVO
// fs.unlinkSync('pruebafs.txt');