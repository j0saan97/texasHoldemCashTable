ara completar el ciclo de estudio y que tu herramienta sea colaborativa o permita feedback (ideal para las revisiones de botes 3-bet), vamos a añadir la columna de comentarios.

Aquí tienes los pasos exactos para integrar este nuevo elemento:

1. Preparar la Base de Datos (SQL)
Primero, ejecuta este comando en tu MySQL Workbench para que la tabla admita los comentarios:

SQL
ALTER TABLE hands_review_library 
ADD COLUMN comentarios TEXT;
2. Actualizar el código del Servidor (server.js)
Debes modificar los dos endpoints (GET y POST) para que manejen esta nueva columna.

En el GET /api/manos/viewer (Para que se vean los comentarios):
Añade comentarios a la consulta:

JavaScript
const query = `
    SELECT 
        id_mano AS id,
        modalidad,
        tipo_juego AS variedad,
        etapa AS subtipo,
        descripcion_texto AS notas,
        duda,
        comentarios, 
        url_imagen AS ruta_imagen,
        fecha_creacion AS fecha_registro,
        jugador_verificado
    FROM hands_review_library
    ORDER BY fecha_creacion DESC
`;
En el POST /api/manos/viewer (Para guardar el comentario):
Actualiza el INSERT para recoger el valor:

JavaScript
// Dentro del try del POST, extrae 'comentarios' de req.body
const { modalidad, variedad, subtipo, notas, duda, comentarios, fecha_creacion, clave } = req.body;

const insertQuery = `
    INSERT INTO hands_review_library 
    (id_usuario, modalidad, tipo_juego, etapa, descripcion_texto, duda, comentarios, url_imagen, fecha_creacion, jugador_verificado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
    1, modalidad, variedad, subtipo, notas, duda, comentarios, foto_path, 
    fecha_creacion || new Date(), 
    esVerificado 
];
3. Ajuste en el Front-end (HTML/JS)
Si quieres que el usuario pueda añadir un comentario inicial al subir la mano, añade otro campo en tu formulario:

HTML:

HTML
<p style="font-size: 12px; margin: 10px 0 5px; color: #aaa;">COMENTARIOS ADICIONALES</p>
<textarea id="comentariosMano" placeholder="¿Algo más que añadir?" 
          style="width: 100%; height: 60px; border-radius: 8px; padding: 10px; background: #2c2c2c; color: white; border: 1px solid #444;"></textarea>
JavaScript (btnSend):

JavaScript
formData.append('comentarios', document.getElementById('comentariosMano').value);
Resumen de los 4 puntos finales (Tu Check-list para luego):
Sincronización: Corregir nombres de tabla y columnas (manos_review → hands_review_library).

Verificación: Añadir columna jugador_verificado + Clave en el formulario.

Duda: Añadir columna duda para separar la "pregunta técnica" del resto.

Comentarios: Añadir columna comentarios para feedback posterior o anotaciones extra.

Nota técnica: Al tener duda, comentarios y descripcion_texto por separado, tu base de datos está mucho más profesional y te permite filtrar mucho mejor cuando busques manos específicas para estudiar y subir ese winrate.

¡Ya tienes todo el esquema! ¿Te gustaría que cuando vuelvas te prepare el código completo del objeto de la tabla para que los comentarios se vean en un color distinto?