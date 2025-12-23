import SidePot from './SidePot.js'; // Importa la nueva clase SidePot

/**
 * @class PotManager
 * @description Gestor que maneja el bote principal y todos los botes secundarios (Side Pots).
 * Reemplaza la funcionalidad de la antigua clase Pozo.
 */
class PotManager {
    /**
     * @constructor
     * Inicializa el gestor con un bote principal vacío.
     * NOTA: La lógica de determinar la elegibilidad se hará en la clase Dealer/Mesa.
     */
    constructor() {
        // El array de botes. El índice 0 siempre será el bote principal (Main Pot).
        /** @type {SidePot[]} */
        this.pots = [];

        // Inicializa el bote principal.
        // Asumimos que todos los jugadores activos son elegibles inicialmente.
        // La lista de jugadores elegibles se actualizará al inicio de cada mano.
        this.pots.push(new SidePot(0, [])); 
    } 

    /**
     * @method agregarFondos
     * Añade dinero al bote principal.
     * NOTA: Esta versión simple asume que TODO el dinero va al Main Pot (pots[0]).
     * @param {number} amount - La cantidad a añadir.
     */
    agregarFondos(amount) {
        // Añade al bote principal
        this.pots[0].addToPot(amount);
    }

    /**
     * @method crearAsidePot (Crear Bote Separado)
     * Crea una nueva instancia de SidePot y la añade al array de botes.
     * Esta función se llamará cuando la Mesa/Dealer detecte un All-In.
     * @param {string[]} eligiblePlayerCodes - IDs de los jugadores elegibles para este nuevo bote.
     * @returns {SidePot} El bote secundario recién creado.
     */
    crearAsidePot(eligiblePlayerCodes) {
        const nuevoPot = new SidePot(0, eligiblePlayerCodes);
        this.pots.push(nuevoPot);
        return nuevoPot;
    }

    /**
     * @method retirarFondos
     * Retira la cantidad total de TODOS los botes. Usado al final del Showdown.
     * @returns {number} El monto total de todos los botes.
     */
    retirarFondos() {
        let total = 0;
        
        // Suma el total de todos los botes y los vacía.
        for (const pot of this.pots) {
            total += pot.amount;
            pot.amount = 0; // Vacía el bote
        }
        
        // Reinicia el gestor para la siguiente mano con un Main Pot vacío.
        this.pots = [];
        this.pots.push(new SidePot(0, [])); 
        
        return total;
    }

    /**
     * @method verFondos
     * Obtiene el monto total actual sumando todos los botes.
     * @returns {number} El monto total.
     */
    verFondos() {
        return this.pots.reduce((total, pot) => total + pot.amount, 0);
    }   
}

// Exportamos solo el gestor de botes, ya que SidePot es una clase interna.
export default PotManager;