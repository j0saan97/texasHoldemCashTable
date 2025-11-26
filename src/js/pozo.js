/**
 * @class Pozo
 * @description Clase que gestiona el bote principal (main pot) de la mesa de póker.
 * Su principal responsabilidad es acumular las apuestas realizadas por los jugadores.
 * NOTA: Esta versión simple NO maneja botes secundarios (side pots).
 */
class Pozo {
    /**
     * @constructor
     * Inicializa el pozo.
     * @param {number} amount - El monto inicial del pozo (usualmente 0 al comienzo de la mano).
     */
    constructor(amount) {
        // Almacena el monto total de dinero acumulado en el pozo principal.
        this.amount = amount; 
    } 
    
    /**
     * @method agregarFondos
     * Añade dinero al pozo total. Se usa cada vez que un jugador apuesta, iguala o sube.
     * @param {number} amount - La cantidad a añadir al pozo.
     */
    agregarFondos(amount) {
        this.amount += amount;
    }

    /**
     * @method retirarFondos
     * Retira una cantidad específica de dinero del pozo para ser entregada al ganador.
     * @param {number} amount - La cantidad a retirar.
     * @returns {boolean} True si la operación es exitosa, false si el monto es mayor que el pozo.
     */
    retirarFondos(amount) {
        // 1. Verificación: Asegura que el monto a retirar no exceda el pozo total.
        if (amount > this.amount) {
            console.error("Error: Fondos insuficientes en el pozo para retirar.");
            return false;
        }
        
        // 2. Transacción: Reduce el monto del pozo.
        this.amount -= amount;
        
        // ⚠️ CORRECCIÓN CRÍTICA:
        // La línea 'this.saldoEnMesa += amount;' no pertenece aquí. El Pozo
        // solo gestiona el bote; no tiene una propiedad 'saldoEnMesa', ni debe
        // actualizar el stack de ningún jugador. Esa lógica es externa a esta clase.
        // Se ha comentado esta línea para corregir la lógica:
        // this.saldoEnMesa += amount; 

        // 3. Devolver la cantidad (aunque en JS no se devuelve aquí, el método que llama
        // a 'retirarFondos' sabrá que el dinero ya se restó y debe entregarse).
        return true; 
    }

    /**
     * @method verFondos
     * Obtiene el monto total actual del pozo.
     * @returns {number} El monto total.
     */
    verFondos() {
        return this.amount;
    }   
}

export default Pozo;