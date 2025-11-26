import Cartera from "./cartera.js"; // Importa la clase Cartera para gestionar el dinero del jugador.

/**
 * @class Jugador
 * @description Representa a un jugador en la mesa de póker.
 * Almacena su estado, fondos, cartas y la mano final evaluada.
 */
class Jugador {

    /**
     * @constructor
     * @param {string | null} [nombre=null] - Nombre legible del jugador.
     * @param {string | null} [codigo=null] - Código único o ID del jugador.
     * @param {Mesa | null} [mesa=null] - Referencia a la mesa en la que está sentado.
     * @param {string | null} [posicion=null] - Posición inicial en la mesa (ej. 'BU', 'BB').
     */
    constructor(nombre = null, codigo = null, mesa = null, posicion = null) {
        // Inicializa la cartera del jugador con un saldo inicial.
        this.cartera = new Cartera(1000); 
        
        this.nombre = nombre;
        this.codigo = codigo;
        
        // Array para almacenar las cartas repartidas al jugador (hole cards).
        this.cartas = [];
        
        // Estado del jugador: true si está en la mano actual, false si ha 'foldado' o está ausente.
        this.activo = true; 
        
        this.mesa = mesa;
        this.posicion = posicion;
        
        // NUEVA PROPIEDAD CLAVE: Almacenará el resultado del EvaluadorManos.
        // Debe contener el rango (número) y la descripción de la mejor mano (ej. {rango: 4, nombre: 'Full House', cartas: [...]}).
        /** @type {Object | null} */
        this.manoEvaluada = null; 
    }

    /**
     * @method igualar
     * Realiza la acción de 'Call' (igualar) la apuesta actual.
     * Implementa la lógica de mover la cantidad requerida al bote.
     */
    igualar() {
        // Lógica de Call: calcular la diferencia entre la apuesta actual de la mesa 
        // y lo que el jugador ya ha puesto. Luego llamar a apostarDinero con esa diferencia.
    }

    /**
     * @method foldear
     * Realiza la acción de 'Fold' (retirarse de la mano).
     */
    foldear() {
        this.activo = false; // El jugador ya no participa en la mano actual.
        // NOTA: Las cartas deben ser descartadas/ocultadas.
    }
    
    /**
     * @method apostarDinero
     * Mueve dinero del stack del jugador ('dineroEnMesa') al bote de la mesa.
     * Esto simula la acción de APOSTAR o SUBIR (Bet/Raise).
     * @param {number} amount - La cantidad a apostar.
     */
    apostarDinero(amount) {
        // En tu implementación original, Jugador llama a Cartera y Mesa.
        // La lógica correcta debe ser: Jugador llama a Cartera para transferir desde su stack, 
        // y Mesa debe ser notificada para actualizar el bote.
        
        // Lógica: 
        // 1. Verificar si el jugador tiene suficiente en this.cartera.dineroEnMesa.
        // 2. this.cartera.moverAlBote(amount) (método que deberías añadir a Cartera).
        // 3. this.mesa.añadirAlBote(amount).

        this.mesa.apostarDinero(amount);
        this.cartera.apostarDinero(amount);
    }

    /**
     * @method retirarseDeMesa
     * Permite al jugador abandonar la mesa y llevarse su dinero.
     * @returns {boolean} True si se retira exitosamente.
     */
    retirarseDeMesa() {
        // Lógica para devolver this.cartera.dineroEnMesa a this.cartera.saldoEnCuenta,
        // y luego remover al jugador de this.mesa.jugadores.
        return false;
    }

    /**
     * @method verCartas
     * Genera la representación HTML de las dos cartas del jugador.
     * @returns {string | void} El HTML de las cartas o un mensaje de error si no tiene cartas.
     */
    verCartas() {
        if (this.cartas.length === 0) {
            console.log("No tienes cartas.");
        } else {
            // Utiliza el método verCartaHTML() de la clase Carta para cada carta.
            return `<div class="cartas-mesa">
                        ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                    </div>`;
        }
    }
}

export default Jugador;