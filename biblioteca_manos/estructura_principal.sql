-- 1. Tabla de Variedades (MTT, CASH, SPIN)
CREATE TABLE variedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Tabla de Subtipos (PKO, 6Max, Nitro, etc.)
CREATE TABLE subtipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    variedad_id INT,
    nombre VARCHAR(100) NOT NULL,
    FOREIGN KEY (variedad_id) REFERENCES variedades(id)
);

-- 3. Tabla de Categorías (Clasificaciones: Errores, Top Value, etc.)
CREATE TABLE categorias (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- 4. Tabla Principal de Manos
CREATE TABLE manos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modalidad ENUM('NoLimitHoldem', 'PotLimitOmaha') NOT NULL,
    variedad_id INT,
    subtipo_id INT,
    nivel_stake VARCHAR(50), 
    tipo_rival VARCHAR(50),
    notas TEXT,
    ruta_imagen VARCHAR(255), 
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variedad_id) REFERENCES variedades(id),
    FOREIGN KEY (subtipo_id) REFERENCES subtipos(id)
);

-- 5. Tabla Intermedia para Categorías (Muchos a Muchos)
CREATE TABLE mano_categorias (
    mano_id INT,
    categoria_id INT,
    PRIMARY KEY (mano_id, categoria_id),
    FOREIGN KEY (mano_id) REFERENCES manos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);