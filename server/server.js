const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Cambia por tu usuario
    password: 'root', // Cambia por tu contraseña
    database: 'animales'       // Cambia por tu base de datos
});
db.connect((err) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        process.exit(1);
    }
    console.log('Conectado a MySQL');
});

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Servir archivos estáticos
    if (req.method === 'GET' && req.url.startsWith('/public/')) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('Not found');
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
        return;
    }

    // Ruta principal
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // CRUD: Obtener todos los animales
    if (req.method === 'GET' && req.url === '/api/animales') {
        db.query('SELECT * FROM ANIMAL', (err, results) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error en la base de datos' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
        return;
    }

    // CRUD: Crear un nuevo animal
    if (req.method === 'POST' && req.url === '/api/animales') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const data = JSON.parse(body);
            db.query(
                'INSERT INTO ANIMAL (ID_ANIMAL, NOMBRE_ANIMAL, ESPECIE_ANIMAL) VALUES (?, ?, ?)',
                [data.ID_ANIMAL, data.NOMBRE_ANIMAL, data.ESPECIE_ANIMAL],
                (err, result) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error al insertar' }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ id: data.ID_ANIMAL }));
                }
            );
        });
        return;
    }

    // CRUD: Actualizar un animal
    if (req.method === 'PUT' && req.url.startsWith('/api/animales/')) {
        const id = req.url.split('/').pop();
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            const data = JSON.parse(body);
            db.query(
                'UPDATE ANIMAL SET NOMBRE_ANIMAL = ?, ESPECIE_ANIMAL = ? WHERE ID_ANIMAL = ?',
                [data.NOMBRE_ANIMAL, data.ESPECIE_ANIMAL, id],
                (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Error al actualizar' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Actualizado' }));
                }
            );
        });
        return;
    }

    // CRUD: Eliminar un animal
    if (req.method === 'DELETE' && req.url.startsWith('/api/animales/')) {
        const id = req.url.split('/').pop();
        db.query('DELETE FROM ANIMAL WHERE ID_ANIMAL = ?', [id], (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error al eliminar' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Eliminado' }));
        });
        return;
    }

    // Ruta no encontrada
    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});