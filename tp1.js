const url = "https://thronesapi.com/api/v2/Characters"

// a) Recuperar la información de todos los personajes (GET).
async function mostrarPersonaje() {
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            console.log("Error");
        }
        const todos = await resp.json();
        const final = JSON.stringify(todos)
        return final

    }
    catch (error) {
        console.log(`Error ${error}`)
    }
}

// b) Agregar un nuevo personaje (POST). Solos se puede modificar.

async function agregarPersonajeApi(nuevo) {
    try {
        const resp = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevo)
        })

        if (!resp.ok) {
            console.log(`Error en la petición ${resp.status}`);
        }

        const agrego = await resp.json();
        return agrego

    } catch (error) {
        console.log(`Error ${error}`);
    }
}

const agregar = {
    id: 0,
    firstName: "Ryan",
    lastName: "Dahl",
    fullName: "Ryan Dahl",
    title: "King of Node",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
}


// c) Buscar la información de un determinado personaje, utilizando un “id” como parámetro
// (GET).

async function obtenerPersonaje(id) {
    try {
        const resp = await fetch(`${url}/${id}`);

        if (!resp.ok) {
            console.log("Error en la petición");
        }

        const obtener = await resp.json();
        const final = JSON.stringify(obtener, null, 2)
        return final

    } catch (error) {
        console.log(`Error ${error}`);
    }
}

// d) Persistir los datos de la primer consulta en un archivo local JSON.
import fs from 'fs/promises';

async function persistirPersonajes() {
    try {
        const listaApi = await mostrarPersonaje();

        await fs.writeFile("./personajes.json", listaApi);

        return "Archivo guardado correctamente";

    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

// Métodos comunes y avanzados – File System
// a) Agregar un personaje al final del archivo.

const agregarPersonaje = async (nuevo) => {
    const datos = await fs.readFile("./personajes.json", "utf-8");

    const listaPersonajes = JSON.parse(datos);
    listaPersonajes.push(nuevo);

    await fs.writeFile("./personajes.json", JSON.stringify(listaPersonajes, null, 2))

    return ("Nuevo personaje agregado correctamente")

}

const nuevoPersonaje = {
    id: 54,
    firstName: "Ryan",
    lastName: "Dahl",
    fullName: "Ryan Dahl",
    title: "King of Node",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
}


// b) Agregar dos personajes al inicio del archivo.
const agregarDosPersonajes = async (nuevo) => {
    const datos = await fs.readFile("./personajes.json", "utf-8");

    const listaPersonajes = JSON.parse(datos);
    listaPersonajes.unshift(...nuevo);

    await fs.writeFile("./personajes.json", JSON.stringify(listaPersonajes, null, 2))

    return ("Nuevos personajes agregados correctamente")

}

const nuevosPersonajes = [{
    id: 55,
    firstName: "Brendan",
    lastName: "Eich",
    fullName: "Brendan Eich",
    title: "King of JS",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"},
    {id: 56,
    firstName: "Guido",
    lastName: "van Rossum",
    fullName: "Guido van Rossum",
    title: "King of Python",
    family: "C++",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"}
]

// c) Eliminar el primer personaje, mostrar en consola el elemento eliminado.
const eliminarPrimero = async () => {
    const datos = await fs.readFile("./personajes.json", "utf-8");

    const lista = JSON.parse(datos);
    const eliminado = lista.shift();
    const mostrar = JSON.stringify(eliminado, null, 2)

    const final = JSON.stringify(lista, null, 2);
    await fs.writeFile("./personajes.json", final)

    return mostrar;
}

// d) Crear un nuevo archivo que solo contenga los: id y nombres de los personajes.

const listaCompleta = await mostrarPersonaje();

const listaArray = JSON.parse(listaCompleta);

let listaReducida = listaArray.map( personaje =>  ({
    id: personaje.id,
    fullName: personaje.fullName
}));

const crearNuevoArchivo = async (listaReducida) => {
    
    await fs.writeFile("./archivo2.json", JSON.stringify(listaReducida, null, 2))
    return ("Nuevo archivo creado correctamente.")

} 

// e) Para los datos anteriores ordenar por nombre y de forma decreciente, luego mostrar por consola (investigar método sort()).

const ordenar = async () => {
    const listaDesordenada = await fs.readFile("./archivo2.json", "utf-8");
    const lista = JSON.parse(listaDesordenada);

    lista.sort((a, b) => (a.fullName < b.fullName ? 1 : -1));

    const mostrar = JSON.stringify(lista, null, 2)

    await fs.writeFile("./archivo2.json", mostrar)

    return mostrar;
}

// Imprimir en consola para verificar todas las operaciones realizadas.
async function main() {
    const mostrar = await mostrarPersonaje();
    console.log(`a) Recuperar la información de todos los personajes (GET). ${mostrar}`)

    const agregarApi = await agregarPersonajeApi(agregar);
    console.log(`b) Agregar un nuevo personaje (POST). Solos se puede modificar. ${agregarApi}`)

    const buscar = await obtenerPersonaje(11);
    console.log(`c) Buscar la información de un determinado personaje, utilizando un “id” como parámetro ${buscar}`)

    const persistir = await persistirPersonajes();
    console.log(`d) Persistir los datos de la primer consulta en un archivo local JSON. ${persistir}`)

    console.log(`Métodos comunes y avanzados – File System`)
    
    const nuevo = await agregarPersonaje(nuevoPersonaje);
    console.log(`a) Agregar un personaje al final del archivo. ${nuevo}`)

    const nuevos = await agregarDosPersonajes(nuevosPersonajes);
    console.log(`b) Agregar dos personajes al inicio del archivo. ${nuevos}`)

    const eliminado = await eliminarPrimero(0);
    console.log(`c) Eliminar el primer personaje, mostrar en consola el elemento eliminado. ${eliminado}`)

    const mensaje = await crearNuevoArchivo(listaReducida);
    console.log(`d) Crear un nuevo archivo que solo contenga los: id y nombres de los personajes. ${mensaje}`)

    const mostrarLista = await ordenar();
    console.log(`e) Para los datos anteriores ordenar por nombre y de forma decreciente, luego mostrar por
consola (investigar método sort()).${mostrarLista}`)

}

main();








