CREATE DATABASE IF NOT EXISTS texas_holdem_cash_table;
USE texas_holdem_cash_table;

-- ======================================
-- POKER DATABASE - TEXAS HOLD'EM
-- ======================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    alias VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ciega VARCHAR(4),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avatar VARCHAR(4),
    user_type VARCHAR(20) DEFAULT 'player',
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de cartera (gestiona los fondos de cada jugador)
CREATE TABLE IF NOT EXISTS cartera(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    saldo_en_cuenta DECIMAL(12,2) DEFAULT 0.00,
    dinero_en_mesa DECIMAL(12,2) DEFAULT 0.00,
    saldo_total DECIMAL(12,2) GENERATED ALWAYS AS (saldo_en_cuenta + dinero_en_mesa) STORED,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Agregar referencia de cartera en usuarios
ALTER TABLE usuarios ADD COLUMN cartera_id INT UNIQUE AFTER activo;
ALTER TABLE usuarios ADD CONSTRAINT fk_usuario_cartera FOREIGN KEY (cartera_id) REFERENCES cartera(id) ON DELETE SET NULL;

-- Tabla de mesas
CREATE TABLE IF NOT EXISTS mesas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    stake VARCHAR(10) UNIQUE NOT NULL,
    descripcion VARCHAR(255) DEFAULT '-',
    ciega_minima DECIMAL(10,4) NOT NULL,
    ciega_maxima DECIMAL(10,4) NOT NULL,
    ante DECIMAL(10,4) NOT NULL,
    max_jugadores INT DEFAULT 6,
    estado VARCHAR(20) DEFAULT 'activa',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de sesiones de juego
CREATE TABLE IF NOT EXISTS sesiones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    mesa_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    estado VARCHAR(20) DEFAULT 'activa',
    pot_total DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (mesa_id) REFERENCES mesas(id)
);

-- Tabla de manos jugadas
CREATE TABLE IF NOT EXISTS manos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesion_id INT NOT NULL,
    numero_mano INT,
    dealer_id INT,
    small_blind_id INT,
    big_blind_id INT,
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    ganador_id INT,
    pot_final DECIMAL(12,2),
    cartas_community VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'completada',
    FOREIGN KEY (sesion_id) REFERENCES sesiones(id),
    FOREIGN KEY (dealer_id) REFERENCES usuarios(id),
    FOREIGN KEY (small_blind_id) REFERENCES usuarios(id),
    FOREIGN KEY (big_blind_id) REFERENCES usuarios(id),
    FOREIGN KEY (ganador_id) REFERENCES usuarios(id)
);

-- Tabla de participación en manos
CREATE TABLE IF NOT EXISTS participantes_mano(
    id INT AUTO_INCREMENT PRIMARY KEY,
    mano_id INT NOT NULL,
    usuario_id INT NOT NULL,
    posicion VARCHAR(10),
    cartas_privadas VARCHAR(10),
    apuesta_inicial DECIMAL(12,2),
    apuesta_total DECIMAL(12,2),
    acciones VARCHAR(255),
    gano BOOLEAN DEFAULT FALSE,
    monto_ganado DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (mano_id) REFERENCES manos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ======================================
-- DATOS DE PRUEBA
-- ======================================

INSERT INTO usuarios (nombre, apellidos, username, alias, email, password, direccion, ciudad, pais, telefono, avatar) VALUES 
('Alejandro', 'Díaz Navarro', 'AlexD', 'ElFénix', 'alex.diaz@ejemplo.com', '1234_1', 'C/ Sol, 14', 'Madrid', 'España', '34600112233', '👩‍🦰'),
('Laura', 'Gómez Martín', 'LauG', 'Gambito', 'laura.gomez@ejemplo.com', '1234_2', 'Av. Luna, 2A', 'Barcelona', 'España', '34611223344','👱‍♀️'),
('Carlos', 'Sánchez Pérez', 'SanCheez', 'MáquinaDeHacerDinero', 'carlos.sanchez@ejemplo.com', '1234_3', 'Pza. Mayor, 5', 'Valencia', 'España', '34622334455','👱‍♀️'),
('Sofía', 'Ruiz Fernández', 'SofiR', 'QueenOfHearts', 'sofia.ruiz@ejemplo.com', '1234_4', 'Ronda Exterior, 8', 'Sevilla', 'España', '34633445566','👱‍♀️'),
('Javier', 'Hernández López', 'JaviH', 'ElProfesor', 'javier.hernandez@ejemplo.com', '1234_5', 'C/ Río Ebro, 12', 'Bilbao', 'España', '34644556677','👱‍♀️'),
('Beatriz', 'Herrera Díaz', 'BeaHD', 'TightBea', 'beatriz.herrera@ejemplo.com', '1234_42', 'C/ Río Duero, 3', 'Cuenca', 'España', '34632345678','👱‍♀️');

-- Insertar mesas con diferentes stakes
INSERT INTO mesas (nombre, stake, descripcion, ciega_minima, ciega_maxima, ante, max_jugadores) VALUES
('Mesa NL2', 'NL2', 'No Limit 2 - Micros', 0.01, 0.02, 0.002, 6),
('Mesa NL5', 'NL5', 'No Limit 5 - Bajos', 0.02, 0.05, 0.005, 6),
('Mesa NL10', 'NL10', 'No Limit 10', 0.05, 0.10, 0.01, 6),
('Mesa NL25', 'NL25', 'No Limit 25', 0.10, 0.25, 0.02, 6),
('Mesa NL50', 'NL50', 'No Limit 50', 0.25, 0.50, 0.05, 6),
('Mesa NL100', 'NL100', 'No Limit 100 - Medios', 0.50, 1.00, 0.10, 6),
('Mesa NL200', 'NL200', 'No Limit 200', 1.00, 2.00, 0.20, 6),
('Mesa NL400', 'NL400', 'No Limit 400', 2.00, 4.00, 0.40, 6),
('Mesa NL600', 'NL600', 'No Limit 600', 3.00, 6.00, 0.60, 6),
('Mesa NL1000', 'NL1000', 'No Limit 1000 - Altos', 5.00, 10.00, 1.00, 6),
('Mesa NL2000', 'NL2000', 'No Limit 2000 - High Stakes', 10.00, 20.00, 2.00, 6),
('Mesa NL5000', 'NL5000', 'No Limit 5000 - Very High Stakes', 25.00, 50.00, 5.00, 6),
('Mesa NL10000', 'NL10000', 'No Limit 10000 - Ultra High Stakes', 50.00, 100.00, 10.00, 6);

-- Insertar carteras para los usuarios iniciales
INSERT INTO cartera (usuario_id, saldo_en_cuenta, dinero_en_mesa) VALUES
(1, 5000.00, 0.00),
(2, 3500.00, 0.00),
(3, 7200.00, 0.00),
(4, 4100.00, 0.00),
(5, 6000.00, 0.00);

-- Actualizar referencia de cartera en usuarios
UPDATE usuarios SET cartera_id = 1 WHERE id = 1;
UPDATE usuarios SET cartera_id = 2 WHERE id = 2;
UPDATE usuarios SET cartera_id = 3 WHERE id = 3;
UPDATE usuarios SET cartera_id = 4 WHERE id = 4;
UPDATE usuarios SET cartera_id = 5 WHERE id = 5;