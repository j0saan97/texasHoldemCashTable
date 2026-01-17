CREATE TABLE mesas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    stake VARCHAR(10) UNIQUE NOT NULL,
    descripcion VARCHAR(255) DEFAULT '-',
    ciega_minima DECIMAL(10,4) NOT NULL,
    ciega_maxima DECIMAL(10,4) NOT NULL,
    ante DECIMAL(10,4) NOT NULL
);