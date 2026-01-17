/**
 * @class ApiClient
 * @description Cliente para comunicarse con la API del servidor
 */
class ApiClient {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
    }

    async obtenerTurnoSiguiente(mesaId) {
    }
    /**
     * @method obtenerUsuarios
     * @description Obtiene todos los usuarios desde la API
     * @returns {Promise<Array>} Array de usuarios
     */
    async obtenerUsuarios() {
        try {
            const response = await fetch(`${this.baseURL}/api/usuarios`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const usuarios = await response.json();
            return usuarios;
        } catch (error) {
            console.error('✗ Error al obtener usuarios:', error.message);
            throw error;
        }
    }

    /**
     * @method obtenerUsuarioPorId
     * @description Obtiene un usuario específico por su ID
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>} Objeto del usuario
     */
    async obtenerUsuarioPorId(usuarioId) {
        try {
            const response = await fetch(`${this.baseURL}/api/usuario?id=${usuarioId}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const usuario = await response.json();
            return usuario;
        } catch (error) {
            console.error('✗ Error al obtener usuario:', error.message);
            throw error;
        }
    }

    /**
     * @method obtenerCartera
     * @description Obtiene la cartera de un usuario
     * @param {number} usuarioId - ID del usuario
     * @returns {Promise<Object>} Objeto de cartera
     */
    async obtenerCartera(usuarioId) {
        try {
            const response = await fetch(`${this.baseURL}/api/cartera?usuarioId=${usuarioId}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const cartera = await response.json();
            return cartera;
        } catch (error) {
            console.error('✗ Error al obtener cartera:', error.message);
            throw error;
        }
    }
}

export default ApiClient;
