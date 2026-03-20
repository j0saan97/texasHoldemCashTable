import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import DatabaseConnection from './src/db/connection.js';
import multer from 'multer';
import { load } from 'cheerio';

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
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const query = parseQuery(parsedUrl.search.substring(1));

    // --- API: OBTENER MANOS (GET) ---
    if (pathname === '/api/manos/viewer' && req.method === 'GET') {
        try {
            await db.inicializar();
            const querySql = `
                SELECT 
                    m.id, m.modalidad, v.nombre AS variedad, s.nombre AS subtipo,
                    m.nivel_stake, m.tipo_rival, m.notas, m.duda, m.posicion,
                    m.ruta_imagen, m.fecha_registro,
                    GROUP_CONCAT(c.nombre) AS categorias
                FROM manos_review m
                LEFT JOIN variedades v ON m.variedad_id = v.id
                LEFT JOIN subtipos s ON m.subtipo_id = s.id
                LEFT JOIN mano_categorias mc ON m.id = mc.mano_id
                LEFT JOIN categorias c ON mc.categoria_id = c.id
                GROUP BY m.id
                ORDER BY m.fecha_registro DESC
            `;
            const manos = await db.ejecutarConsulta(querySql);
            await db.cerrarConexion();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(manos));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // --- API: GUARDAR MANO (POST) ---
    if (pathname === '/api/manos/viewer' && req.method === 'POST') {
        upload.single('foto_mano')(req, res, async (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: err.message }));
                return;
            }

            try {
                await db.inicializar();

                // 1. EXTRAER DUDA Y POSICION DEL BODY
                const { modalidad, variedad, subtipo, nivel, rival, notas, duda, posicion, categorias } = req.body;
                
                let categoriasArray = categorias ? JSON.parse(categorias) : [];
                let foto_path = req.file ? req.file.filename : null;

                // Lógica de IDs para variedad
                let variedad_id = null;
                const varRes = await db.ejecutarConsulta('SELECT id FROM variedades WHERE nombre = ?', [variedad]);
                variedad_id = varRes.length > 0 ? varRes[0].id : (await db.ejecutarConsulta('INSERT INTO variedades (nombre) VALUES (?)', [variedad])).insertId;

                // Lógica de IDs para subtipo
                let subtipo_id = null;
                const subRes = await db.ejecutarConsulta('SELECT id FROM subtipos WHERE nombre = ? AND variedad_id = ?', [subtipo, variedad_id]);
                subtipo_id = subRes.length > 0 ? subRes[0].id : (await db.ejecutarConsulta('INSERT INTO subtipos (variedad_id, nombre) VALUES (?, ?)', [variedad_id, subtipo])).insertId;

                // 2. INSERTAR INCLUYENDO LOS NUEVOS CAMPOS
                const insertMano = await db.ejecutarConsulta(
                    'INSERT INTO manos_review (modalidad, variedad_id, subtipo_id, nivel_stake, tipo_rival, notas, duda, posicion, ruta_imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [modalidad, variedad_id, subtipo_id, nivel, rival, notas, duda, posicion, foto_path]
                );
                
                const mano_id = insertMano.insertId;

                // Insertar categorías
                for (const catId of categoriasArray) {
                    await db.ejecutarConsulta('INSERT INTO mano_categorias (mano_id, categoria_id) VALUES (?, ?)', [mano_id, catId]);
                }

                await db.cerrarConexion();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success', message: 'Mano guardada con éxito' }));
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: error.message }));
            }
        });
        return;
    }

    // --- SERVIR ARCHIVOS ESTÁTICOS Y UPLOADS ---
    let filePath = path.join(__dirname, pathname);
    if (pathname === '/' || pathname === '') filePath = path.join(__dirname, 'index.html');

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
});
