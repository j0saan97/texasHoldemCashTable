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
        }
    }

    igualar() {
        console.log(`Jugador ${this.codigo} (${this.nombre}) ha igualado.`);
    }

    chequear(){
        console.log(`Jugador ${this.codigo} (${this.nombre}) ha chequeado.`);
    }

    foldear() {
        this.activo = false; // El jugador ya no participa en la mano actual.
        console.log(`Jugador ${this.codigo} (${this.nombre}) ha foldeado.`);
    }
    
    apostarDinero(amount) {
        this.mesa.apostarDinero(amount);
        this.cartera.apostarDinero(amount);

        const mainPotEl = document.getElementById('main-pot-total');
        if (mainPotEl) {
            console.log(`Actualizando el pozo principal a ${this.mesa.pozo.amount} después de la apuesta de ${amount} por parte del jugador ${this.codigo} (${this.nombre}).`);
            mainPotEl.innerHTML = this.mesa.pozo.amount;
        }
    }

    verCartas() {
        if (this.cartas.length === 0) {
            console.log("No tienes cartas.");
        } else {
            // Utiliza el método verCartaHTML() de la clase Carta para cada carta.
            return `
                <div id="player-${this.codigo}" class="player-seat seat-${this.codigo}">
                    <!-- Contenedor principal de info del jugador -->
                    <div class="player-info-card relative p-2">
                        <!-- Icono/Avatar del jugador -->
                        <div class="flex flex-row items-center">
                            <div class="w-10 h-10 bg-gray-600 rounded-full mb-1 flex items-center justify-center text-xl text-white border-2 border-gray-400">
                            👱‍♀️
                            </div>
                            <div class="w-10 h-10 bg-gray-600 rounded-full mb-1 flex items-center justify-center text-xl text-white border-2 border-gray-400">
                                ${this.ciegaActual}
                            </div>
                            <div class="w-10 h-10 mb-1 flex items-center justify-center text-xl text-white">
                                ${this.ciegaActual === 'BB' ? this.stakeBB + '€' : this.ciegaActual === 'SB' ? this.stakeSB + '€' : this.stakeAntes + '€'}
                            </div>
                        </div>

                        <!-- Stack y nombre -->
                        <!-- Cartas (Ocultas/Cerradas) -->
                        <div class="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1">
                            ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                        </div>
                        <div class="flex flex-col items-center" style="margin-top:10px">
                            <div class="flex items-center gap-4" id="user_controls_${this.codigo}">

                                <!-- Slider de apuesta y botones de acción -->
                                <div>
                                    <div class="flex-grow flex items-center gap-2" style="min-width:150px">
                                        <input type="range" min="0" max="${this.cartera.saldoEnCuenta}" value="${this.cartera.saldoEnCuenta}" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                                        <input type="number" value="${this.cartera.saldoEnCuenta}" class="bg-blue-600 text-white font-bold w-20 py-1 text-center rounded-lg focus:outline-none">
                                    </div>
                                </div>

                                <!-- Botones de acción del jugador -->
                                <div class="flex flex-row gap-1">
                                    <button id="btn-nombre-${this.codigo}" class="btn btn-sm btn-info" style="width:100%">
                                        ${this.nombre}
                                    </button>
                                    <button class="btn btn-sm btn-success"  style="width:100%;max-height:30px" onclick="window.apostarJugador && window.apostarJugador('${this.codigo}')">
                                        Apostar
                                    </button>
                                    <button class="btn btn-sm btn-info"  style="width:100%;max-height:30px" onclick="window.igualarJugador && window.igualarJugador('${this.codigo}')">
                                        Igualar
                                    </button>
                                    <button class="btn btn-sm btn-danger" style="width:100%;max-height:30px" onclick="window.foldearJugador && window.foldearJugador('${this.codigo}')">
                                        Fold
                                    </button>
                                    <button class="btn btn-sm btn-danger" style="width:100%;max-height:30px" onclick="window.chequearJugador && window.chequearJugador('${this.codigo}')">
                                        Chequear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
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



