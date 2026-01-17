CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    alias VARCHAR(50) UNIQUE NOT NULL,
    -- Contraseña cifrada (hashed) del usuario para seguridad. Es obligatoria.
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(4),
    ciega VARCHAR(4),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    telefono VARCHAR(20),
    -- DEFAULT CURRENT_TIMESTAMP: Establece automáticamente la fecha y hora actuales al crearse el registro.
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);