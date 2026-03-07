import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import DatabaseConnection from './src/db/connection.js';
import multer from 'multer';

// Cargar variables de entorno
dotenv.config();

// Obtener directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const publicDir = path.dirname(__dirname);

// Instancia de conexión a BD
const db = new DatabaseConnection();

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: storage });

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
    if (pathname === '/api/manos' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                await db.inicializar();

                // Obtener datos
                const { modalidad, variedad, subtipo, nivel, rival, notas, categorias } = data;

                // Insertar en variedades si no existe
                let variedad_id = null;
                const variedadesResult = await db.ejecutarConsulta('SELECT id FROM variedades WHERE nombre = ?', [variedad]);
                if (variedadesResult.length > 0) {
                    variedad_id = variedadesResult[0].id;
                } else {
                    const insertVar = await db.ejecutarConsulta('INSERT INTO variedades (nombre) VALUES (?)', [variedad]);
                    variedad_id = insertVar.insertId;
                }

                // Insertar en subtipos si no existe
                let subtipo_id = null;
                const subtiposResult = await db.ejecutarConsulta('SELECT id FROM subtipos WHERE nombre = ? AND variedad_id = ?', [subtipo, variedad_id]);
                if (subtiposResult.length > 0) {
                    subtipo_id = subtiposResult[0].id;
                } else {
                    const insertSub = await db.ejecutarConsulta('INSERT INTO subtipos (variedad_id, nombre) VALUES (?, ?)', [variedad_id, subtipo]);
                    subtipo_id = insertSub.insertId;
                }

                // Insertar en manos_review
                const insertMano = await db.ejecutarConsulta(
                    'INSERT INTO manos_review (modalidad, variedad_id, subtipo_id, nivel_stake, tipo_rival, notas) VALUES (?, ?, ?, ?, ?, ?)',
                    [modalidad, variedad_id, subtipo_id, nivel, rival, notas]
                );
                const mano_id = insertMano.insertId;

                // Insertar categorías
                for (const catId of categorias) {
                    await db.ejecutarConsulta('INSERT INTO mano_categorias (mano_id, categoria_id) VALUES (?, ?)', [mano_id, catId]);
                }

                await db.cerrarConexion();

                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ status: 'success', message: 'Mano guardada con éxito' }));
            } catch (error) {
                console.error('Error al guardar la mano:', error);
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ status: 'error', message: error.message }));
            }
        });
        return;
    }

    if (pathname === '/api/manos/viewer' && req.method === 'GET') {
        try {
            await db.inicializar();
            // Consulta para obtener todas las manos con sus detalles
            const query = `
                SELECT 
                    m.id,
                    m.modalidad,
                    v.nombre AS variedad,
                    s.nombre AS subtipo,
                    m.nivel_stake,
                    m.tipo_rival,
                    m.notas,
                    m.ruta_imagen,
                    m.fecha_registro,
                    GROUP_CONCAT(c.nombre) AS categorias
                FROM manos_review m
                LEFT JOIN variedades v ON m.variedad_id = v.id
                LEFT JOIN subtipos s ON m.subtipo_id = s.id
                LEFT JOIN mano_categorias mc ON m.id = mc.mano_id
                LEFT JOIN categorias c ON mc.categoria_id = c.id
                GROUP BY m.id
                ORDER BY m.fecha_registro DESC
            `;
            const manos = await db.ejecutarConsulta(query);
            await db.cerrarConexion();
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(manos), 'utf-8');
        } catch (error) {
            res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message }), 'utf-8');
        }
        return;
    }

    if (pathname === '/api/manos/viewer' && req.method === 'POST') {
        console.log('POST /api/manos/viewer - Recibiendo datos con imagen');
        upload.single('foto_mano')(req, res, async (err) => {
            if (err) {
                console.error('Error en multer:', err);
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ status: 'error', message: err.message }));
                return;
            }

            try {
                await db.inicializar();

                // Obtener datos del body (FormData)
                const { modalidad, variedad, subtipo, nivel, rival, notas, categorias } = req.body;
                let categoriasArray = [];
                if (categorias) {
                    categoriasArray = JSON.parse(categorias);
                }

                // Manejar imagen
                let foto_path = null;
                if (req.file) {
                    foto_path = req.file.filename; // Nombre del archivo guardado
                }

                // Insertar en variedades si no existe
                let variedad_id = null;
                const variedadesResult = await db.ejecutarConsulta('SELECT id FROM variedades WHERE nombre = ?', [variedad]);
                if (variedadesResult.length > 0) {
                    variedad_id = variedadesResult[0].id;
                } else {
                    const insertVar = await db.ejecutarConsulta('INSERT INTO variedades (nombre) VALUES (?)', [variedad]);
                    variedad_id = insertVar.insertId;
                }

                // Insertar en subtipos si no existe
                let subtipo_id = null;
                const subtiposResult = await db.ejecutarConsulta('SELECT id FROM subtipos WHERE nombre = ? AND variedad_id = ?', [subtipo, variedad_id]);
                if (subtiposResult.length > 0) {
                    subtipo_id = subtiposResult[0].id;
                } else {
                    const insertSub = await db.ejecutarConsulta('INSERT INTO subtipos (variedad_id, nombre) VALUES (?, ?)', [variedad_id, subtipo]);
                    subtipo_id = insertSub.insertId;
                }

                // Insertar en manos_review
                const insertMano = await db.ejecutarConsulta(
                    'INSERT INTO manos_review (modalidad, variedad_id, subtipo_id, nivel_stake, tipo_rival, notas, ruta_imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [modalidad, variedad_id, subtipo_id, nivel, rival, notas, foto_path]
                );
                const mano_id = insertMano.insertId;

                // Insertar categorías
                for (const catId of categoriasArray) {
                    await db.ejecutarConsulta('INSERT INTO mano_categorias (mano_id, categoria_id) VALUES (?, ?)', [mano_id, catId]);
                }

                await db.cerrarConexion();

                res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ status: 'success', message: 'Mano guardada con éxito' }));
            } catch (error) {
                console.error('Error al guardar la mano:', error);
                res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
                res.end(JSON.stringify({ status: 'error', message: error.message }));
            }
        });
        return;
    }

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

    // Servir archivos de uploads
    if (pathname.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, pathname);
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(200, { 'Content-Type': mimeType });
                res.end(content, 'utf-8');
            }
        });
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
