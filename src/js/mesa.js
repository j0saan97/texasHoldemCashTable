import Dealer from "./dealer.js"; // Importa la clase Dealer, responsable del reparto y flujo.
import Pozo from "./pozo.js";     // Importa la clase Pozo (Pot) para gestionar el bote de la partida.
import ciegasPorStake from "./ciegasPorStake.js"; // Importa la configuración de ciegas por tipo de mesa.

/**
 * @class Mesa
 * @description Representa la mesa de póker real donde se lleva a cabo la partida.
 * Contiene a los jugadores, las cartas comunitarias, el bote y al dealer.
 */
class Mesa {
    /**
     * @constructor
     * Inicializa la mesa.
     * @param {string} codigo - Código o ID único de la mesa.
     * @param {number} amount - Monto o límite de la mesa (aunque 'amount' parece ser redundante con el 'pozo').
     * @param {string} stake - El tipo de juego (ej. "NL2", "NL5", etc.).
     */
    constructor(codigo, amount, stake="NL2") {
        // Inicializa el bote (pot) de la mesa con un saldo inicial de 0.
        this.pozo = new Pozo(amount);
        
        // Propiedad que puede representar el límite o ciegas de la mesa.
        //this.amount = this.pozo.amount;
        
        this.codigo = codigo;
        
        // Array para almacenar las cartas comunitarias (Flop, Turn, River).
        /** @type {Carta[]} */
        this.cartas = [];
        
        // Array para almacenar todas las instancias de la clase Jugador en la mesa.
        /** @type {Jugador[]} */
        this.jugadores = [];
        
        // Instancia de la clase Dealer, que gestionará la mano.
        /** @type {Dealer | null} */
        this.dealer = null;

        // Tipo de juego (stake), por defecto "NL2".
        if (stake in ciegasPorStake) {
            this.stake = ciegasPorStake[stake];
        } else {
            this.stake = ciegasPorStake["NL2"]; // Valor por defecto si el stake no es válido.
        }
    }

    /**
     * @method apostarDinero
     * Centraliza la acción de mover dinero al pozo. Es llamado por la clase Jugador
     * o directamente por el Dealer al colocar las ciegas.
     * @param {number} amount - La cantidad a añadir al bote.
     */
    apostarDinero(amount) {
        // Delega la acción de agregar fondos a la instancia de Pozo.
        this.pozo.agregarFondos(amount);
        // NOTA: Esta función en la clase Mesa no debería llamarse 'apostarDinero', sino 'añadirAlBote' o 'recolectarApuesta' 
        // para evitar confusión con el método de la clase Cartera.
    }
    
    /**
     * @method verCartasJugadores
     * Genera y devuelve el HTML que representa las cartas de *todos* los jugadores.
     * Se usa principalmente para el *showdown* (revelación de manos).
     * @returns {string} HTML que contiene las cartas de cada jugador.
     */
    
    verCartasJugadores() {
        // Itera sobre todos los jugadores y llama al método verCartas() de cada uno.
        return `<div>
                    ${this.jugadores.map(jugador => jugador.verCartas()).join('')}
                </div>`;
    }

    /**
     * @method verCartasHTML
     * Genera y devuelve el HTML de las cartas comunitarias (board) de la mesa.
     * @returns {string} HTML que representa las cartas comunitarias o un mensaje si no hay.
     */
    verCartasHTML() {
        if (this.cartas.length === 0) {
            // Muestra un mensaje si aún no se ha repartido ninguna carta comunitaria.
            return `<div>
                        <span>No hay cartas en la mesa</span>
                    </div>`;
        } else {
            // Itera sobre el array de cartas comunitarias y genera su HTML.
            return `<div class="cartas-mesa">
                        ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                    </div>`;
        }
    }

    /**
     * @method sentarJugador
     * Añade una instancia de Jugador a la mesa.
     * @param {Jugador} jugador - Instancia del jugador a añadir.
     */
    sentarJugador(jugador) {
        this.jugadores.push(jugador);
        jugador.mesa = this; // Opcional: Establecer la referencia inversa.
        // TODO: Asignar una posición libre al jugador (BU, BB, SB, etc.)
    }
}

export default Mesa; // Exporta la clase Mesa.