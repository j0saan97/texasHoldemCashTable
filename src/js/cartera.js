/**
 * @class Cartera
 * @description Gestiona y rastrea los fondos de un jugador. Separa el dinero
 * total del jugador en dos categorías: saldo disponible para cargar a la mesa
 * y dinero que actualmente está en juego (en la mesa).
 */
class Cartera {

    /**
     * @constructor
     * Inicializa la cartera del jugador.
     * @param {number} amount - El monto inicial de dinero que tiene el jugador en su cuenta.
     */
    constructor(amount) {
        // Saldo total disponible del jugador, generalmente en la cuenta bancaria o saldo general.
        // Es el dinero que puede 'cargar' a la mesa.
        this.saldoEnCuenta = amount;
        
        // Dinero que el jugador ha cargado en la mesa de póker y que está actualmente en juego.
        // Es la cantidad máxima que el jugador puede perder o ganar en la mano actual.
        this.dineroEnMesa = 0;
    } 

    /*
     * Nota de la estructura de fondos:
     * 1. saldoEnCuenta: Dinero fuera de la mesa.
     * 2. dineroEnMesa: Dinero apostado o en el stack actual.
     * 3. saldoTotal: Suma de ambos, que es el patrimonio total del jugador.
     */
    
    /**
     * @property {number} saldoTotal
     * @description Propiedad de solo lectura que calcula el patrimonio total del jugador.
     * @returns {number} La suma de saldoEnCuenta y dineroEnMesa.
     */
    get saldoTotal() {
        return this.saldoEnCuenta + this.dineroEnMesa;
    }

    /**
     * @method agregarFondos
     * Añade dinero al saldo de la cuenta del jugador (fuera de la mesa).
     * Esto simula un depósito o una recarga.
     * @param {number} monto - La cantidad de dinero a añadir.
     */
    agregarFondos(monto) {
        this.saldoEnCuenta += monto;
    }

    /**
     * @method apostarDinero
     * Mueve dinero de 'saldoEnCuenta' a 'dineroEnMesa' (cargar/comprar fichas).
     * Se usa cuando el jugador hace un *buy-in* o recarga su stack en la mesa.
     * @param {number} monto - La cantidad de dinero a mover a la mesa.
     * @returns {boolean} True si la operación fue exitosa, false si no hay fondos suficientes.
     */
    apostarDinero(monto) {
        // 1. Verificación de fondos: No se puede mover más dinero del que está disponible en la cuenta.
        if (monto > this.saldoEnCuenta) {
            console.error("Fondos insuficientes en la cuenta para hacer la carga/apuesta.");
            return false;
        }
        
        // 2. Transacción: Reduce el saldo disponible en la cuenta.
        this.saldoEnCuenta -= monto;
        
        // 3. Transacción: Aumenta el dinero disponible para jugar en la mesa (el stack).
        this.dineroEnMesa += monto;
        
        return true;
    }
}

export default Cartera; // Exporta la clase Cartera para su uso por la clase Jugador.


