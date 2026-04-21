// const fs = require('fs');
import fs from 'fs';

const url = "https://thronesapi.com/api/v2/Characters";
const fileName = 'characters.json';
const reducedFileName = 'reducedCharacters.json';


async function getCharactersFromUrl() {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
                
        const characters = await res.json();
        return characters;
    } catch (error) {
        console.error("Error en fetch a la API: ", error);
        return null;
    }
}

async function getCharactersFromFS(file) {
    try {
        const data = await fs.promises.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { // Manejar el error cuando el archivo no existe.
            return null;
        }
        console.error("Error al leer el sistema de archivos: ", error);
        return null;
    }
}

function saveCharactersToJSON(characters) {
    fs.promises.writeFile(fileName, JSON.stringify(characters, null, 2));
}

async function getCharacters() {
    try {
        let characters = await getCharactersFromFS(fileName);
        if (!characters) {
            characters = await getCharactersFromUrl()
            
            if (characters) {
                saveCharactersToJSON(characters);
            }
        }
        return characters;
    } catch (error) {
        console.error("Error en fetch de personajes: ", error);
    }
}

const personajes = await getCharacters();
// console.log(personajes);


async function getCharacterById(id) {
    try {
        const res = await fetch(`${url}/${id}`);
        if (!res.ok) {
            console.error("Respusta no OK.");
        }

        const character = await res.json();

        return character;

    } catch (error) {
        console.error("Error en fetch: ", error);
    }
}

const nedStark = await getCharacterById(6);
// console.log(nedStark);


async function createFullCharacterUsingAPI(firstName, lastName, title, family, image, imageUrl) {

    const newCharacter = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        title: title.trim(),
        family: family.trim(),
        image: image.trim(),
        imageUrl: imageUrl.trim()
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCharacter)
        });

        if (!res.ok) {
            throw new Error(`Error en la creación del personaje: status ${res.status}`);
        }

        console.log(`Petición exitosa. El servidor respondió con status: ${res.status}`);
        console.log('Personaje agregado:', newCharacter)

        const textRes = await res.text();

        if (!textRes) {
            console.log('Personaje aceptado por el servidor (no devolvió datos adicionales en el body).');
            return res.status;
        }

        const data = await res.json();
        console.log('Personaje creado exitosamente:', data);

        return data;

    } catch (error) {
        console.error('Hubo un problema al crear el personaje:', error);
    }
}

// createFullCharacterUsingAPI("Ariel", "Levita", "Cebador de Mate  ", "Casa con Onda", "", "")


function getGreaterId(characters) {
    if (characters) {
        const characterIds = characters.map(character => character.id);
        const sortedIds = characterIds.sort((a, b) => a - b);
        return sortedIds[sortedIds.length - 1]
    } else {
        console.error('No se encontraron personajes.')
    }
}

async function addCharacterAtTheEnd(firstName, lastName, title, family, image, imageUrl) {
    try {
        let characters = await getCharacters();
        const greaterId = getGreaterId(characters);

        const newCharacter = {
            id: greaterId + 1,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            fullName: `${firstName.trim()} ${lastName.trim()}`,
            title: title.trim(),
            family: family.trim(),
            image: image.trim(),
            imageUrl: imageUrl.trim()
        };

        characters.push(newCharacter);
        saveCharactersToJSON(characters)
        console.log(`Personaje agregado: ${newCharacter.fullName}.`)
    } catch (error) {
        console.error('Hubo un problema al agregar un nuevo personaje al final:', error);
    }
}

// addCharacterAtTheEnd("Ariel", "Levita", "Cebador de Mate  ", "Casa con Onda", "", "")


async function addTwoCharactersAtTheBeginning(c1, c2) {
    try {
        let characters = await getCharacters();
        const greaterId = getGreaterId(characters);

        const newChar1 = {
            id: greaterId + 1,
            ...c1
        }

        const newChar2 = {
            id: greaterId + 2,
            ...c2
        }

        characters.unshift(newChar1, newChar2);
        saveCharactersToJSON(characters)
        console.log(`Personajes agregados: ${newChar1.fullName} y ${newChar2.fullName}.`)
    } catch (error) {
        console.error('Hubo un problema al agregar nuevos personajes al inicio:', error);
    }
}

const newC1 = {
    firstName: "María",
    lastName: "Olivares",
    fullName: "María Olivares",
    title: "Champion of Telemarketsville",
    family: "House of Mics",
    image: "",
    imageUrl: ""
};

const newC2 = {
    firstName: "Elisa",
    lastName: "Beltramone",
    fullName: "Elisa Beltramone",
    title: "Neutral to the Bone",
    family: "Good, thanks",
    image: "",
    imageUrl: ""
};

// addTwoCharactersAtTheBeginning(newC1, newC2)


async function removeFirstCharacterFromTheBeginning() {
    try {
        let characters = await getCharacters();

        let removedCharacter = characters.shift();

        saveCharactersToJSON(characters)
        console.log(`Personaje eliminado: ${removedCharacter.fullName}.`)
    } catch (error) {
        console.error('Hubo un problema al eliminar el primer personaje:', error);
    }
}

// removeFirstCharacterFromTheBeginning()


async function createReducedCharactersFile() {
    try {
        let characters = await getCharacters();

        const reducedCharacters = characters.map(character => ({
            id: character.id,
            firstName: character.firstName,
            lastName: character.lastName,
            fullName: character.fullName
        }));

        await fs.promises.writeFile(reducedFileName, JSON.stringify(reducedCharacters, null, 2));
        console.log('Archivo creado.')
    } catch (error) {
        console.error('Hubo un problema al crear el archivo:', error);
    }
}

// createReducedCharactersFile()


async function sortCharactersDescending() {
    try {
        let reducedCharacters = await getCharactersFromFS(reducedFileName);

        reducedCharacters.sort((a, b) => {
            if (a.firstName < b.firstName) {
                return 1;
            }
            if (a.firstName > b.firstName) {
                return -1;
            }
            return 0;
        });

        console.log('Personajes ordenados por nombre de forma decreciente', reducedCharacters)
    } catch (error) {
        console.error('Hubo un problema al ordenar los personajes:', error);
    }
}

// sortCharactersDescending()