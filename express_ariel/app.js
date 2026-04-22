import express from 'express';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
process.loadEnvFile();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.engine('handlebars', expressHandlebars.engine({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.get('/', (req, res) => 
    res.render('inicio', {title: 'Inicio - Web de Ariel'})
);

app.get('/institucional', (req, res) => 
    res.render('institucional', {title: 'Institucional'})
);

app.get('/contacto', (req, res) => 
    res.render('contacto', {title: 'Contacto'})
);

app.post('/especialidades', (req, res) => {
    console.log(post);
    console.log(req.body.nombre);
    res.send({'estado': 'ok', 'msg': 'Creado'});
})

app.use((req, res) => {
    res.status(404);
    res.send('Error 404 - Recurso no encontrado')
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500);
    res.send('error 500 - Algo anda mal en el servidor')
});

app.listen(port || 3000, () => console.log(`Express started on http://localhost:${port}`));