// TP 1 JavaScript

const fs = require('fs').promises;

const url = 'https://thronesapi.com/api/v2/Characters';

const personajePrueba = {
    firstName: "Gabriel",
    lastName: "Roman",
    fullName: "Gabriel Roman",
    title: "Programacion 3",
    family: "Grupo J",
    image: "QueriamosGrupo8.jpg",
    imageUrl: "https://thronesapi.com/assets/images/QueriamosGrupo8.jpg"
};

const personajeFinal = { 
    id: 54, 
    firstName: "Caminante", 
    lastName: "Blanco",
    fullName: "Caminante Blanco", 
    title: "Invierno",
    family: "Caminantes",
    image: "caminante1.jpg",
    imageUrl: "https://thronesapi.com/assets/images/caminante1.jpg"
};

const personajeInicio1 = { 
    id: 55, 
    firstName: "Caminante", 
    lastName: "Negro",
    fullName: "Caminante Negro", 
    title: "Invierno",
    family: "Caminantes",
    image: "caminante2.jpg",
    imageUrl: "https://thronesapi.com/assets/images/caminante2.jpg"
};

const personajeInicio2 = { 
    id: 56, 
    firstName: "Caminante", 
    lastName: "Azul",
    fullName: "Caminante Azul", 
    title: "Invierno",
    family: "Caminantes",
    image: "caminante3.jpg",
    imageUrl: "https://thronesapi.com/assets/images/caminante3.jpg"
};

// API Fetch - File System

// 1.a) Recuperar la información de todos los personajes (GET)
async function obtenerPersonajes() {
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            console.log('Error en la petición a la API');
            return;
        }
        const personajes = await respuesta.json();
        console.log(`Se recuperaron ${personajes.length} personajes de la API.`);
        return personajes;
    } catch (error) {
        console.log(`Error capturado: ${error}`);
    }
}

// 1.b) Agregar un nuevo personaje (POST)
async function agregarPersonajeAPI(nuevoPersonaje) {
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoPersonaje)
        });
        if (!respuesta.ok) {
            console.log('Error al intentar agregar el personaje a la API');
            return;
        }
        const personajeCreado = await respuesta.json();
        console.log(personajeCreado);
    } catch (error) {
        console.log(`Error capturado en POST: ${error}`);
    }
}

// 1.c) Buscar la información de un determinado personaje por "id" (GET)
async function obtenerPersonajePorId(id) {
    try {
        const respuesta = await fetch(`${url}/${id}`);
        if (!respuesta.ok) {
            console.log(`No se encontró el personaje con ID: ${id}`);
            return;
        }
        const personaje = await respuesta.json();
        console.log(personaje);
        return personaje;
    } catch (error) {
        console.log(`Error al buscar por ID: ${error}`);
    }
}

// 1.d) Persistir los datos de la primer consulta en un archivo local JSON
async function guardarPersonajesEnJSON() {
    try {
        const personajes = await obtenerPersonajes();
        if (!personajes) {
            console.log('Error: No hay datos para guardar.');
            return;
        }
        const personajesJSON = JSON.stringify(personajes, null, 2);
        await fs.writeFile('./personajes.json', personajesJSON);
        console.log('"personajes.json" creado y datos guardados');
    } catch (error) {
        console.log(`Error al crear el archivo JSON: ${error}`);
    }
}


// Métodos comunes y avanzados - File System

// 2.a) Agregar un personaje al final del archivo
async function agregarPersonajeAlFinal(nuevoPersonajeLocal) {
    try {
        const datosLeidos = await fs.readFile('./personajes.json', 'utf-8');
        const listaPersonajes = JSON.parse(datosLeidos);
        
        listaPersonajes.push(nuevoPersonajeLocal);
        
        const datosParaGuardar = JSON.stringify(listaPersonajes, null, 2);
        await fs.writeFile('./personajes.json', datosParaGuardar);
        console.log(`Lista actualizada: ahora hay ${listaPersonajes.length} personajes.`);
    } catch (error) {
        console.log(`Error al modificar el archivo en 2.a: ${error}`);
    }
}

// 2.b) Agregar dos personajes al inicio del archivo
async function agregarPersonajesAlInicio(personaje1, personaje2) {
    try {
        const datosLeidos = await fs.readFile('./personajes.json', 'utf-8');
        const listaPersonajes = JSON.parse(datosLeidos);
        
        listaPersonajes.unshift(personaje1, personaje2);
        
        const datosParaGuardar = JSON.stringify(listaPersonajes, null, 2);
        await fs.writeFile('./personajes.json', datosParaGuardar);
        console.log(`Los primeros ahora son: ${listaPersonajes[0].fullName} y ${listaPersonajes[1].fullName}`);
    } catch (error) {
        console.log(`Error al modificar el archivo en 2.b: ${error}`);
    }
}

// 2.c) Eliminar el primer personaje y mostrar en consola el elemento eliminado
async function eliminarPrimerPersonaje() {
    try {
        const datosLeidos = await fs.readFile('./personajes.json', 'utf-8');
        const listaPersonajes = JSON.parse(datosLeidos);
        
        if (listaPersonajes.length === 0) 
            return;
        
        const personajeEliminado = listaPersonajes.shift();
        
        const datosParaGuardar = JSON.stringify(listaPersonajes, null, 2);
        await fs.writeFile('./personajes.json', datosParaGuardar);
        console.log('El personaje eliminado es:', personajeEliminado);
    } catch (error) {
        console.log(`Error al modificar el archivo en 2.c: ${error}`);
    }
}

// 2.d) Crear un nuevo archivo que solo contenga los id y nombres de los personajes
async function crearArchivoResumido() {
    try {
        const datosLeidos = await fs.readFile('./personajes.json', 'utf-8');
        const listaPersonajes = JSON.parse(datosLeidos);
        
        const personajesResumidos = listaPersonajes.map(personaje => {
            return {
                id: personaje.id,
                nombre: personaje.fullName 
            };
        });
        
        const datosParaGuardar = JSON.stringify(personajesResumidos, null, 2);
        await fs.writeFile('./personajes_resumido.json', datosParaGuardar);
        console.log(`Se procesaron ${personajesResumidos.length} personajes. Muestra de los primeros 2:`, personajesResumidos.slice(0, 2));
    } catch (error) {
        console.log(`Error al crear el archivo resumido en 2.d: ${error}`);
    }
}

// 2.e) Ordenar por nombre de forma decreciente y mostrar por consola
async function ordenarPersonajesDescendente() {
    try {
        const datosLeidos = await fs.readFile('./personajes_resumido.json', 'utf-8');
        const listaPersonajes = JSON.parse(datosLeidos);
        
        listaPersonajes.sort((a, b) => {
            if (a.nombre > b.nombre) return -1;
            if (a.nombre < b.nombre) return 1;
            return 0;
        });
        // Hay otra forma usando localeCompare
        //listaPersonajes.sort((a, b) => b.nombre.localeCompare(a.nombre));

        console.log(listaPersonajes);
    } catch (error) {
        console.log(`Error al ordenar el archivo en 2.e: ${error}`);
    }
}


async function ejecutarTP() {
    await obtenerPersonajes();
    await agregarPersonajeAPI(personajePrueba);
    await obtenerPersonajePorId(5); 
    await guardarPersonajesEnJSON(); 
    
    await agregarPersonajeAlFinal(personajeFinal);
    await agregarPersonajesAlInicio(personajeInicio1, personajeInicio2);
    await eliminarPrimerPersonaje();
    await crearArchivoResumido();
    await ordenarPersonajesDescendente();
}

ejecutarTP();