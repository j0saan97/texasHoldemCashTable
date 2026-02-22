import Cartera from "./cartera.js"; // Importa la clase Cartera para gestionar el dinero del jugador.

class Jugador {

    /**
     * @constructor
     * @param {string | null} [nombre=null] - Nombre legible del jugador.
     * @param {string | null} [codigo=null] - Código único o ID del jugador.
     * @param {Mesa | null} [mesa=null] - Referencia a la mesa en la que está sentado.
     * @param {string | null} [posicion=null] - Posición inicial en la mesa (ej. 'BU', 'BB').
     */
    constructor(nombre = null, codigo = null, mesa = null, posicion = null, ciegaActual = null) {
        // Inicializa la cartera del jugador con un saldo inicial.
        this.cartera = new Cartera(1000); 
        
        this.nombre = nombre;
        this.codigo = codigo;
        
        // Array para almacenar las cartas repartidas al jugador (hole cards).
        this.cartas = [];
        
        // Estado del jugador: true si está en la mano actual, false si ha 'foldado' o está ausente.
        this.activo = true; 
        
        // Indica si es la ciega (BB o SB) actual.
        this.ciegaActual = ciegaActual;

        this.mesa = mesa;
        this.posicion = posicion;
        this.stakeBB = this.mesa ? this.mesa.stake.BB + this.mesa.stake.Ante: 0; // Valor de la ciega grande según el stake de la mesa.
        this.stakeSB = this.mesa ? this.mesa.stake.SB + this.mesa.stake.Ante: 0; // Valor de la ciega pequeña según el stake de la mesa.
        this.stakeAntes = this.mesa ? this.mesa.stake.Ante : 0; // Valor del ante según el stake de la mesa.

        // NUEVA PROPIEDAD CLAVE: Almacenará el resultado del EvaluadorManos.
        // Debe contener el rango (número) y la descripción de la mejor mano (ej. {rango: 4, nombre: 'Full House', cartas: [...]}).
        /** @type {Object | null} */
        this.manoEvaluada = null; 

        // Registrar la instancia en un registro global para poder invocarla desde el DOM
        if (typeof window !== 'undefined' && this.codigo != null) {
            window.__jugadores = window.__jugadores || {};
            window.__jugadores[this.codigo] = this;
            // Para rastrear el último jugador que realizó una acción, útil para controlar el flujo del juego.
            window.__ultimoJugadorQueActuo = null;
            // Para controlar a quién le toca actuar
            window.__jugadorEnTurno = null;
        }
    }

    confirmaTurno() {
        // Convertir ambos a string para comparación segura
        const turnoActual = String(window.__jugadorEnTurno);
        const codigoJugador = String(this.codigo);
        
        if (this.codigo == window.__ultimoJugadorQueActuo) {
            console.warn(`No es el turno del jugador ${this.codigo} (${this.nombre}). Acción ignorada. Turno actual: ${turnoActual}`);
            return false;
        }else{
            return true;
        }
    }

    igualar() {
        if (this.confirmaTurno()){
            console.log(`Jugador ${this.codigo} (${this.nombre}) ha igualado.`);
        }        
    }

    chequear(){
        if (this.confirmaTurno()){
            console.log(`Jugador ${this.codigo} (${this.nombre}) ha chequeado.`);
        }
    }

    foldear() {
        if (this.confirmaTurno()){
            this.activo = false; // El jugador ya no participa en la mano actual.
            console.log(`Jugador ${this.codigo} (${this.nombre}) ha foldeado.`);
        }
    }
    
    apostarDinero(amount) {
        if (this.confirmaTurno()){
            this.mesa.apostarDinero(amount);
            this.cartera.apostarDinero(amount);

            const mainPotEl = document.getElementById('main-pot-total');
            if (mainPotEl) {
                console.log(`Actualizando el pozo principal a ${this.mesa.pozo.amount} después de la apuesta de ${amount} por parte del jugador ${this.codigo} (${this.nombre}).`);
                mainPotEl.innerHTML = this.mesa.pozo.amount;
            }
        }
    }

    verCartas() {
    if (!this.cartas || this.cartas.length === 0) {
        return ``;
    }

    const dineroAMostrar = this.ciegaActual === 'BB' ? this.stakeBB : 
                          this.ciegaActual === 'SB' ? this.stakeSB : 
                          (this.stakeAntes || 0);

    return `
        <div id="player-${this.codigo}" class="player-seat seat-${this.codigo}" style="width: 100%; max-width: 280px; margin: auto;">
            <div class="player-info-card relative p-3 bg-gray-800/40 rounded-xl border border-gray-700 shadow-lg">
                
                <div class="flex items-center justify-between mb-3">
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center text-[10px] text-white border-2 border-yellow-500 font-black shadow-inner">
                            ${this.ciegaActual || 'P'}
                        </div>
                        
                        <h1 class="text-white font-bold text-[11px] leading-tight truncate m-0 p-0 text-center" style="max-width: 90px;">
                            ${this.nombre}
                        </h1>
                    </div>
                    <div class="bg-yellow-600/20 px-3 py-1 rounded-full border border-yellow-600/50">
                        <span class="text-yellow-400 font-black text-sm">${dineroAMostrar}€</span>
                    </div>
                </div>

                

                <div class="flex gap-1 justify-center mb-2" style="transform: scale(0.65); transform-origin: center;">
                    ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                </div>



                <div id="user_controls_${this.codigo}" class="flex flex-col gap-3">
                    
                    <div class="flex items-center gap-2 bg-black/30 p-2 rounded-lg">
                        <input type="range" min="0" 
                            max="${this.cartera?.saldoEnCuenta || 0}" 
                            value="${this.cartera?.saldoEnCuenta || 0}" 
                            class="flex-grow h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-500">
                        <input type="number" 
                            value="${this.cartera?.saldoEnCuenta || 0}" 
                            class="bg-gray-900 text-yellow-400 font-bold w-16 py-1 text-center rounded border border-gray-600 text-xs focus:outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <button class="btn btn-sm btn-success w-full font-bold shadow-sm" onclick="window.apostarJugador?.('${this.codigo}')">
                            Apostar
                        </button>
                        <button class="btn btn-sm btn-info w-full font-bold shadow-sm text-white" onclick="window.igualarJugador?.('${this.codigo}')">
                            Igualar
                        </button>
                        <button class="btn btn-sm btn-danger w-full font-bold shadow-sm" onclick="window.foldearJugador?.('${this.codigo}')">
                            Fold
                        </button>
                        <button class="btn btn-sm btn-secondary w-full font-bold shadow-sm" onclick="window.chequearJugador?.('${this.codigo}')">
                            Check
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `;
}
} 


   

// RELACION ENTRE HTML Y FUNCIONES DE LA INSTANCIA JUGADOR:
if (typeof window !== 'undefined') {
    window.foldearJugador = function(codigo) {
        const player = window.__jugadores && window.__jugadores[codigo];
        if (player && typeof player.foldear === 'function') {
            return player.foldear();
        }
    };
    window.chequearJugador = function(codigo) {
        const player = window.__jugadores && window.__jugadores[codigo];
        if (player && typeof player.chequear === 'function') {
            return player.chequear();
        }
    };
    window.igualarJugador = function(codigo) {
        const player = window.__jugadores && window.__jugadores[codigo];
        if (player && typeof player.igualar === 'function') {
            return player.igualar();
        }
    };
    window.apostarJugador = function(codigo) {
        const player = window.__jugadores && window.__jugadores[codigo];
        if (player && typeof player.apostarDinero === 'function') {
            const amount = prompt("¿Cuánto deseas apostar?", player.cartera.saldoEnCuenta);
            if (amount !== null) {
                const numericAmount = parseFloat(amount);
                if (!isNaN(numericAmount) && numericAmount > 0) {
                    console.log(`Jugador ${player.codigo} (${player.nombre}) intenta apostar ${numericAmount}.`);
                    return player.apostarDinero(numericAmount);
                } else {
                    alert("Por favor, ingresa un número válido para apostar.");
                }
            }
        }
    }
}

export default Jugador;



