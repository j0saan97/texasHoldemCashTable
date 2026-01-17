import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

/**
 * @class DatabaseConnection
 * @description Gestiona la conexión a la base de datos MySQL
 * para la aplicación de Texas Hold'em Cash Table
 */
class DatabaseConnection {
    constructor() {
        this.pool = null;
        this.config = {
            host: process.env.DATABASE_HOST || 'localhost',
            user: process.env.DATABASE_USER || 'jose',
            password: process.env.DATABASE_PASSWORD || '6UMZZPzsXv',
            database: process.env.DATABASE_NAME || 'texas_holdem_cash_table',
            port: process.env.DATABASE_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };
    }

    /**
     * @method inicializar
     * @description Inicializa el pool de conexiones a la base de datos
     * @returns {Promise<void>}
     */
    async inicializar() {
        try {
            this.pool = mysql.createPool(this.config);
            console.log('✓ Conexión a base de datos MySQL establecida');
            return true;
        } catch (error) {
            console.error('✗ Error al conectar a la base de datos:', error.message);
            throw error;
        }
    }

    /**
     * @method obtenerConexion
     * @description Obtiene una conexión del pool
     * @returns {Promise<Connection>} Conexión a la base de datos
     */
    async obtenerConexion() {
        try {
            return await this.pool.getConnection();
        } catch (error) {
            console.error('✗ Error al obtener conexión:', error.message);
            throw error;
        }
    }

    /**
     * @method consultarUsuarios
     * @description Obtiene todos los usuarios de la tabla usuarios
     * @returns {Promise<Array>} Array de usuarios
     */
    async consultarUsuarios() {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const [rows] = await connection.query('SELECT * FROM usuarios');
            return rows;
        } catch (error) {
            console.error('✗ Error al consultar usuarios:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method obtenerUsuarioPorId
     * @description Obtiene un usuario específico por su ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object>} Objeto del usuario
     */
    async obtenerUsuarioPorId(id) {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const [rows] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('✗ Error al obtener usuario por ID:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method obtenerUsuarioPorUsername
     * @description Obtiene un usuario por su nombre de usuario
     * @param {string} username - Nombre de usuario
     * @returns {Promise<Object>} Objeto del usuario
     */
    async obtenerUsuarioPorUsername(username) {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const [rows] = await connection.query('SELECT * FROM usuarios WHERE username = ?', [username]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('✗ Error al obtener usuario por username:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method obtenerCarteraUsuario
     * @description Obtiene la cartera de un usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>} Objeto de cartera con saldo_en_cuenta y dinero_en_mesa
     */
    async obtenerCarteraUsuario(usuarioId) {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const [rows] = await connection.query(
                'SELECT * FROM cartera WHERE usuario_id = ?',
                [usuarioId]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('✗ Error al obtener cartera:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method actualizarCartera
     * @description Actualiza los fondos en la cartera de un usuario
     * @param {number} usuarioId - ID del usuario
     * @param {number} saldoEnCuenta - Nuevo saldo en cuenta
     * @param {number} dineroEnMesa - Nuevo dinero en mesa
     * @returns {Promise<Object>} Resultado de la actualización
     */
    async actualizarCartera(usuarioId, saldoEnCuenta, dineroEnMesa) {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const [result] = await connection.query(
                'UPDATE cartera SET saldo_en_cuenta = ?, dinero_en_mesa = ? WHERE usuario_id = ?',
                [saldoEnCuenta, dineroEnMesa, usuarioId]
            );
            return result;
        } catch (error) {
            console.error('✗ Error al actualizar cartera:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method crearRegistro
     * @description Crea un nuevo registro de usuario
     * @param {Object} usuarioData - Datos del usuario
     * @returns {Promise<Object>} Resultado de la inserción
     */
    async crearRegistro(usuarioData) {
        let connection;
        try {
            connection = await this.obtenerConexion();
            const {
                nombre,
                apellidos,
                email,
                username,
                alias,
                password,
                direccion = null,
                ciudad = null,
                pais = null,
                telefono = null,
                avatar = null
            } = usuarioData;

            const [result] = await connection.query(
                `INSERT INTO usuarios 
                (nombre, apellidos, email, username, alias, password, direccion, ciudad, pais, telefono, avatar) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, apellidos, email, username, alias, password, direccion, ciudad, pais, telefono, avatar]
            );

            return result;
        } catch (error) {
            console.error('✗ Error al crear registro:', error.message);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    /**
     * @method cerrarConexion
     * @description Cierra el pool de conexiones
     * @returns {Promise<void>}
     */
    async cerrarConexion() {
        try {
            if (this.pool) {
                await this.pool.end();
                console.log('✓ Conexión a base de datos cerrada');
            }
        } catch (error) {
            console.error('✗ Error al cerrar conexión:', error.message);
            throw error;
        }
    }
}

export default DatabaseConnection;
