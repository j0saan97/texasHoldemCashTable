import Baraja from './baraja.js';           // Importa la clase Baraja para manejar las cartas.
import EvaluadorManos from './evaluadorManos.js'; // Importa la clase para determinar la mejor mano.

/**
 * @class Dealer
 * @description Clase que simula el rol del dealer (repartidor) en la mesa de póker.
 * Es responsable de barajar, repartir cartas, gestionar el flujo del juego (turnos)
 * y determinar el ganador.
 */
class Dealer {
    /**
     * @constructor
     * Inicializa el dealer con las herramientas y la configuración necesarias.
     * @param {string | null} [name=null] - Nombre del dealer (opcional).
     * @param {string | null} [codigo=null] - Código identificador (opcional).
     * @param {Mesa | null} [mesa=null] - Referencia a la instancia de la mesa de juego (crucial).
     */
    constructor(name = null, codigo = null, mesa = null) {
        // Herramienta para evaluar las combinaciones de manos de los jugadores.
        this.evaluador = new EvaluadorManos(); 
        
        // Propiedades de identificación (opcionales).
        this.nombre = name;
        this.codigo = codigo; 
        
        // Referencia a la Mesa, esencial para acceder a jugadores, bote y cartas comunitarias.
        this.mesa = mesa; 

        // Variable para rastrear la fase pre-flop (ej. si hubo una subida, call, etc.) - Inicialmente no se usa aquí.
        this.preflop_fase = ''; 

        // Índice para rastrear la posición actual en el array de orden de acción post-flop.
        this.pos_flop_actual = -1; 
        
        // ORDEN_ACCION_PREFLOP y POSTFLOP: Es mejor importarlos desde un archivo de configuración (config.js).
        // Si no los estás importando, déjalos aquí:
        this.ORDEN_ACCION_PREFLOP = ["UTG", "MP", "CU", "BU", "SB", "BB"];
        this.ORDEN_ACCION_POSTFLOP = ["SB", "BB", "UTG", "MP", "CU", "BU"]; 
        
        // Inicializa y usa una nueva baraja.
        this.baraja = this.usarBaraja(); 
    }

    // --- MÉTODOS DE FLUJO Y TURNOS ---

    /**
     * @method darTurno
     * Avanza al siguiente jugador activo en la secuencia de apuestas.
     * La lógica aquí parece ser para las rondas POST-FLOP, siguiendo ORDEN_ACCION_POSTFLOP.
      NOTA: La lógica actual necesita ajustarse para manejar jugadores no activos (folded).
     */
    darTurno() {
        /* Condiciones para que pase al siguiente jugador:
         Si jugador actual checkea, foldea, iguala o apuesta, dar el turno al siguiente jugador activo.
        */
        
        // Si la posición actual es la última (índice 5), reinicia a 0.
        if (this.pos_flop_actual >= 5) {
            this.pos_flop_actual = 0;
        } else {
            // Avanza al siguiente jugador en el orden de acción.
            this.pos_flop_actual += 1;
        }
        
        // NOTA: Si utilizas las posiciones como clave, deberías usar ORDEN_ACCION_POSTFLOP[this.pos_flop_actual].
    }

    // --- MÉTODOS DE BARAJA Y REPARTO ---

    /**
     * @method usarBaraja
     * Crea una nueva instancia de la baraja (52 cartas ordenadas).
     * @returns {Baraja} La nueva baraja.
     */
    usarBaraja() {
        return new Baraja();
    }

    /**
     * @method barajar
     * Mezcla las cartas en el array this.baraja.cartas utilizando el algoritmo Fisher-Yates,
     * garantizando una distribución uniforme.
     * 
     */
    barajar() {
        // Algoritmo Fisher-Yates 
        let totalCartas = this.baraja.cartas.length;
        for (let i = totalCartas - 1; i > 0; i--) {
            // Genera un índice aleatorio 'j' entre 0 y 'i' (inclusive).
            const j = Math.floor(Math.random() * (i + 1)); 
            // Intercambia el elemento actual (i) con el elemento aleatorio (j).
            [this.baraja.cartas[i], this.baraja.cartas[j]] = [this.baraja.cartas[j], this.baraja.cartas[i]];
        }
    }

    /**
     * @method quemarCarta
     * Retira la carta superior del mazo. En el póker real, esta carta se quema (se descarta)
     * antes de cada ronda comunitaria (Flop, Turn, River) para evitar trampas.
     */
    quemarCarta() {
        // El método pop() retira y devuelve el último elemento (la carta superior del mazo).
        this.baraja.cartas.pop();
        //  Agregar lógica para mostrar la carta quemada boca abajo en el DOM (si se desea).
    }

    /**
     * @method repartir
     * Reparte cartas a todos los jugadores activos.
     * @param {number} [cartasPorJugador=2] - Número de cartas a repartir por jugador.
     * (Por defecto, 2 para las cartas iniciales u *hole cards*).
     */
    repartir(cartasPorJugador = 2) {
        // Itera para repartir la primera, luego la segunda carta, etc.
        for (let i = 0; i < cartasPorJugador; i++) { 
            // Reparte una carta a cada jugador en orden.
            for (const jugador of this.mesa.jugadores) {
                // Saca la carta superior de la baraja y la añade al array de cartas del jugador.
                jugador.cartas.push(this.baraja.cartas.pop()); 
            }
        }
    }

    // --- MÉTODOS DE CARTAS COMUNITARIAS (Board) ---

    /**
     * @method repartirComunitarias
     * Coloca N cartas comunitarias en la mesa. Útil para repartir Flop (3), Turn (1) y River (1).
     * @param {number} total_comunitarias - Cantidad de cartas comunitarias a repartir.
     */
    repartirComunitarias(total_comunitarias) {
        for (let i = 0; i < total_comunitarias; i++) {
            // Saca la carta superior de la baraja y la añade al array de cartas de la mesa (board).
            this.mesa.cartas.push(this.baraja.cartas.pop());
        }
    }
    
    /**
     * @method repartirFlop
     * Reparte las 3 cartas del Flop. En el póker real, se quema 1 carta antes de esto.
     */
    repartirFlop() {
        this.quemarCarta(); // Quema la primera carta.
        this.repartirComunitarias(3); // Reparte las 3 cartas comunitarias del Flop.
    }

    /**
     * @method repartirTurn
     * Reparte la 1 carta del Turn. En el póker real, se quema 1 carta antes de esto.
     */
    repartirTurn() {
        this.quemarCarta(); 
        this.repartirComunitarias(1); 
    }

    /**
     * @method repartirRiver
     * Reparte la 1 carta del River. En el póker real, se quema 1 carta antes de esto.
     */
    repartirRiver() {
        this.quemarCarta(); // Quema la tercera carta.
        this.repartirComunitarias(1); // Reparte la 1 carta comunitaria del River.
    }

    /**
     * @method repartirBoard
     * Conveniencia: Reparte las 5 cartas comunitarias en secuencia (Flop, Turn, River)
     * simulando el flujo de una mano completa.
     */
    repartirBoard() {
        this.repartirFlop(); 
       
        this.repartirTurn(); 
       
        this.repartirRiver(); 
    }

    // --- MÉTODOS DE GANADOR -

    /**
     * @method entregarBoteaGanador
     * Llama al evaluador de manos para determinar la mejor mano entre los jugadores activos
     * y transfiere el bote (pot) al stack del jugador ganador.
     */
    entregarBoteaGanador() {
        // Lógica: 
        // 1. Obtener las 7 cartas (2 del jugador + 5 comunitarias) para cada jugador activo.
        // 2. Usar this.evaluador.evaluarManos() para encontrar la mejor mano.
        // 3. Transferir el monto total del bote (this.mesa.bote) al ganador.
    }
}

export default Dealer;



/*
! Consistencia de Posiciones: Has duplicado los arrays de posiciones en el constructor. Es mejor importarlos del archivo de configuración que acabamos de comentar (config.js) para mantener una única fuente de verdad.

! manejo de Jugadores: El método repartir asume que todos los objetos en this.mesa.jugadores son válidos. En un juego real, deberás asegurarte de que solo reparte a los jugadores activos (que han hecho buy-in y no están sentados fuera).

! Flujo del Turno: La lógica en darTurno() solo avanza un índice. Necesitarás una lógica más robusta que busque al próximo jugador activo que no haya foldado y que sea el primero en actuar en la ronda actual (dependiendo de si es pre-flop o post-flop).
 */ 