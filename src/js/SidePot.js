/**
 * @class SidePot
 * @description Representa un bote individual (principal o secundario).
 * Almacena el monto total y la lista de jugadores que contribuyeron y son elegibles para ganarlo.
 */
class SidePot {
    /**
     * @constructor
     * @param {number} [amount=0] - El monto inicial de este bote.
     * @param {string[]} [eligiblePlayerCodes=[]] - Array de códigos/IDs de jugadores que pueden ganar este bote.
     */
    constructor(amount = 0, eligiblePlayerCodes = []) {
        this.amount = amount;
        // Almacena los códigos de jugador, no objetos completos, para desacoplamiento.
        /** @type {string[]} */
        this.eligiblePlayerCodes = eligiblePlayerCodes;
    }

    /**
     * @method addToPot
     * Añade dinero a este bote específico.
     * @param {number} amount - La cantidad a añadir.
     */
    addToPot(amount) {
        this.amount += amount;
    }
    
    // TODO: Implementar un método para retirar fondos y marcar a un jugador como no elegible.
}