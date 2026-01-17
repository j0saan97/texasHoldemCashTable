import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import DatabaseConnection from './src/db/connection.js';

// Cargar variables de entorno
dotenv.config();

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const publicDir = path.dirname(__dirname);

// Instancia de conexión a BD
const db = new DatabaseConnection();

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Función helper para parsear query strings
function parseQuery(queryString) {
    const query = {};
    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            query[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
    }
    return query;
}

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
    // Configurar CORS - Agregar a TODAS las respuestas
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '3600');

    // Manejo de preflight CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parsear URL
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parseQuery(parsedUrl.search.substring(1));

    // API ENDPOINTS
    if (pathname === '/api/usuarios') {
        try {
            await db.inicializar();
            const usuarios = await db.consultarUsuarios();
            await db.cerrarConexion();
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(usuarios), 'utf-8');
        } catch (error) {
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }), 'utf-8');
        }
        return;
    }

    if (pathname === '/api/usuario' && query.id) {
        try {
            await db.inicializar();
            const usuario = await db.obtenerUsuarioPorId(query.id);
            await db.cerrarConexion();
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(usuario), 'utf-8');
        } catch (error) {
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }), 'utf-8');
        }
        return;
    }

    if (pathname === '/api/cartera' && query.usuarioId) {
        try {
            await db.inicializar();
            const cartera = await db.obtenerCarteraUsuario(query.usuarioId);
            await db.cerrarConexion();
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(cartera), 'utf-8');
        } catch (error) {
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }), 'utf-8');
        }
        return;
    }

    // ARCHIVOS ESTÁTICOS
    let filePath = path.join(__dirname, pathname);
    
    // Si es una ruta raíz, servir index.html
    if (pathname === '/' || pathname === '') {
        filePath = path.join(__dirname, 'index.html');
    }

    // Obtener extensión del archivo
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Leer y servir el archivo
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                // Error del servidor
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 - Error del servidor</h1>', 'utf-8');
                console.error('Error al leer archivo:', err);
            }
        } else {
            // Archivo encontrado, servir con tipo MIME correcto
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`✓ Servidor Node.js iniciado en http://localhost:${PORT}`);
    console.log(`✓ Puerto: ${PORT}`);
    console.log(`✓ Abre tu navegador y ve a: http://localhost:${PORT}`);
    console.log(`✓ API disponible en: http://localhost:${PORT}/api/usuarios`);
});
