
CREATE TABLE hands_review_library (
    id_mano INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL, -- Para saber qué usuario subió la mano
    url_imagen VARCHAR(255) NOT NULL, -- Aquí guardarás la ruta o link de la foto
    descripcion_texto TEXT, -- El análisis o descripción de la jugada
    
    -- Los campos que pediste con opciones fijas
    modalidad ENUM('TEXAS_HOLDEM', 'POT_LIMIT_OMAHA') NOT NULL,
    tipo_juego ENUM('SPIN_AND_GO', 'MTT', 'CASH_GAME') NOT NULL,
    
    -- Campo extra para saber en qué etapa se subió
    etapa ENUM('PREFLOP', 'FLOP', 'TURN', 'RIVER') DEFAULT 'PREFLOP',
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplo de cómo insertarías una mano:
-- Comprobar la tabla
SELECT * FROM hands_review_library;

INSERT INTO hands_review_library (id_usuario, src\db\hands_review_img\4betprte.png, modalidad, tipo_juego, etapa, descripcion_texto)
VALUES (
    1, 
    'db/hands_review_img/4betprte.png', 
    'TEXAS_HOLDEM', 
    'CASH_GAME', 
    'PREFLOP', 
    'Descripción de la mano: 4bet pot con AK contra un rival agresivo.'
);