import fs from 'fs/promises';

const url = "https://thronesapi.com/api/v2/Characters";
const nombreArchivo = 'personajes.json';
const nombreArchivoReducido = 'archivoReducido.json';


async function obtenerPersonajesDesdeUrl() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
                
        const personajes = await res.json();
        return personajes;
    } catch (error) {
        console.error("Error en fetch a la API: ", error);
        return null;
    }
}

async function obtenerPersonajesDesdeFS(archivo) {
    try {
        const datos = await fs.readFile(archivo, 'utf-8');
        return JSON.parse(datos);
    } catch (error) {
        if (error.code === 'ENOENT') { // Manejar el error cuando el archivo no existe.
            return null;
        }
        console.error("Error al leer el sistema de archivos: ", error);
        return null;
    }
}

function guardarPersonajesEnJSON(personajes) {
    fs.writeFile(nombreArchivo, JSON.stringify(personajes, null, 2));
}


// 1.a) Recuperar la información de todos los personajes (GET).
async function obtenerPersonajes() {
    try {
        let personajes = await obtenerPersonajesDesdeFS(nombreArchivo);
        if (!personajes) {
            personajes = await obtenerPersonajesDesdeUrl()
            
            // 1.d) Persistir los datos de la primer consulta en un archivo local JSON.
            if (personajes) {
                guardarPersonajesEnJSON(personajes);
            }
        }
        return personajes;
    } catch (error) {
        console.error("Error en fetch de personajes: ", error);
    }
}

const personajes = await obtenerPersonajes();
// console.log(personajes);

function obtenerMayorId(personajes) {
    if (personajes) {
        const personajesIds = personajes.map(personaje => personaje.id);
        const idsOrdenados = personajesIds.sort((a, b) => a - b);
        return idsOrdenados[idsOrdenados.length - 1]
    } else {
        console.error('No se encontraron personajes.')
    }
}


// 1.b) Agregar un nuevo personaje (POST). Solos se puede modificar.
async function agregarPersonajeApi(personaje) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personaje)
        })

        if (!res.ok) {
            throw new Error(`Error en la creación del personaje: status ${res.status}`);
        }

        console.log(`Petición exitosa. El servidor respondió con status: ${res.status}`);
        console.log('Personaje agregado:', personaje)

        const textoRes = await res.text();

        if (!textoRes) {
            console.log('Personaje aceptado por el servidor (no devolvió datos adicionales en el body).');
            return res.status;
        }

        const personajeAgregado = await res.json();
        console.log('Personaje creado exitosamente:', personajeAgregado);
        return personajeAgregado
    } catch (error) {
        console.log(`Error al agregar personaje a la API: ${error}`);
    }
}

const personajeNuevo = {
    id: 100,
    firstName: "Ryan",
    lastName: "Dahl",
    fullName: "Ryan Dahl",
    title: "King of Node",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
}
// agregarPersonajeApi(personajeNuevo)


// 1.c) Buscar la información de un determinado personaje, utilizando un “id” como parámetro
async function obtenerPersonajePorId(id) {
    try {
        const res = await fetch(`${url}/${id}`);

        if (!res.ok) {
            console.log("Error en la petición de personaje");
        }

        const personaje = await res.json();
        return personaje
    } catch (error) {
        console.log(`Error al obtener personaje por ID: ${error}`);
    }
}

const robb = await obtenerPersonajePorId(11)
// console.log(robb)


// Métodos comunes y avanzados – File System
// 2.a) Agregar un personaje al final del archivo.
const agregarPersonaje = async (personaje) => {
    try {
        const personajes = await obtenerPersonajes();
        const mayorId = obtenerMayorId(personajes);

        let personajeNuevo = {
            id: mayorId + 1,
            ...personaje
        }

        personajes.push(personajeNuevo);
        guardarPersonajesEnJSON(personajes)
        console.log("Nuevo personaje agregado correctamente al final del archivo:", nuevo.fullName)
    } catch (error) {
        console.log('Error al agregar al personaje final del archivo', error)
    }
}

const nuevoPersonaje = {
    firstName: "Ryan",
    lastName: "Dahl",
    fullName: "Ryan Dahl",
    title: "King of Node",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
}

// agregarPersonaje(nuevoPersonaje)


// 2.b) Agregar dos personajes al inicio del archivo.
const agregarDosPersonajes = async (pers1, pers2) => {
    try {
        const personajes = await obtenerPersonajes();
        const mayorId = obtenerMayorId(personajes);
    
        const n1 = {
            id: mayorId + 1,
            ...pers1
        }
    
        const n2 = {
            id: mayorId + 2,
            ...pers2
        }
    
        personajes.unshift(n1, n2);
        guardarPersonajesEnJSON(personajes)
        console.log(`Nuevos personajes agregados correctamente: ${n1.fullName} y ${n2.fullName}`)
    } catch (error) {
        console.log('Error al agregar personajes al inicio del archivo:', error)
    }

}

const p1 = {
    firstName: "Brendan",
    lastName: "Eich",
    fullName: "Brendan Eich",
    title: "King of JS",
    family: "JS",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
};
const p2 = {
    firstName: "Guido",
    lastName: "van Rossum",
    fullName: "Guido van Rossum",
    title: "King of Python",
    family: "C++",
    image: "ryan-dahl.jpg",
    imageUrl: "https://en.wikipedia.org/wiki/Ryan_Dahl#/media/File:Ryan_Dahl.jpg"
}

// agregarDosPersonajes(p1, p2)


// 2.c) Eliminar el primer personaje, mostrar en consola el elemento eliminado.
const eliminarPrimerPersonaje = async () => {
    try {
        const personajes = await obtenerPersonajes();
        const eliminado = personajes.shift();
        
        guardarPersonajesEnJSON(personajes)
        console.log(`Se ha eliminado a: ${eliminado.fullName}`);
    } catch (error) {
        console.error('Error al eliminar el primer personaje del archivo:', error)
    }
}

// eliminarPrimerPersonaje()

// 2.d) Crear un nuevo archivo que solo contenga los: id y nombres de los personajes.
async function crearArchivoReducido() {
    try {
        const personajes = await obtenerPersonajes();

        let listaReducida = personajes.map(personaje => ({
            id: personaje.id,
            fullName: personaje.fullName
        }));

        await fs.writeFile(nombreArchivoReducido, JSON.stringify(listaReducida, null, 2))
        console.log("Nuevo archivo reducido creado correctamente.")
    } catch (error) {
        console.log('Error al crear lista reducida:', error)
    }
}

// crearArchivoReducido()

// 2.e) Para los datos anteriores ordenar por nombre y de forma decreciente, luego mostrar por consola.
const ordenarPersonajesFormaDescendiente = async () => {
    try {
        const personajesReducido = await obtenerPersonajesDesdeFS(nombreArchivoReducido)
    
        personajesReducido.sort((a, b) => (a.fullName < b.fullName ? 1 : -1));
    
        console.log('Los personajes ordenados de forma decreciente son:', personajesReducido)
    } catch (error) {
        console.log('Error al ordenar personajes:', error)
    }
}

// ordenarPersonajesFormaDescendiente()

