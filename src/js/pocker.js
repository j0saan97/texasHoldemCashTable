import Mesa from "./mesa.js";     // Importa la clase Mesa (el contenedor principal).
import Dealer from "./dealer.js"; // Importa la clase Dealer (el gestor del juego).
import Jugador from "./jugador.js"; // Importa la clase Jugador.
import ApiClient from "./apiClient.js"; // Cliente para llamadas a la API

// NOTA: Esta instancia global 'mesa' está redundante, ya que la clase Pocker crea su propia instancia.
// const mesa = new Mesa('Mesa1', 0.0); 

/**
 * @class Pocker
 * @description Clase principal que inicializa y gestiona la estructura de un juego de Texas Hold'em.
 * Actúa como el motor del juego, configurando la Mesa, el Dealer y los Jugadores.
 */
class Pocker {
    /**
     * @constructor
     * @param {number} [totalJugadores=4] - El número de jugadores a sentar inicialmente en la mesa.
     * @param {string} [stake="NL2"] - El tipo de juego (ej. "NL2", "NL5", etc.).
     */
    constructor(totalJugadores = 4, stake="NL2") {
        // Inicializa la Mesa de juego.
        /** @type {Mesa} */
        this.mesa = this.crearMesa(stake);
        
        // Inicializa el Dealer y lo asigna a la Mesa.
        /** @type {Dealer} */
        this.dealer = this.crearDealer();
        
        // Array de posiciones de mesa 6-max (UTG, MP, CU, BU, SB, BB).
        // SUGERENCIA: Importar esto desde config.js para evitar duplicidad.
        this.posiciones = ["UTG", "MP", "CU", "BU", "SB", "BB"];
        
        // Cliente API para obtener datos del servidor
        /** @type {ApiClient} */
        this.api = new ApiClient();
        
        // Almacenar el total de jugadores
        this.totalJugadores = totalJugadores;
        
        // Iniciar el juego automáticamente
        this.iniciarJuego();
    }

    /**
     * @method crearMesa
     * Crea e inicializa una nueva instancia de la clase Mesa.
     * @returns {Mesa} La instancia de la Mesa creada.
     */
    crearMesa(stake) {
        // El '0.0' en el constructor de Mesa parece ser un valor por defecto o límite.
        return new Mesa('Mesa1', 0.0, stake); 
    }

    /**
     * @method crearDealer
     * Crea una instancia de Dealer, la asigna a la mesa y guarda la referencia.
     * @returns {Dealer} La instancia del Dealer creada.
     */
    crearDealer() {
        const nuevoDealer = new Dealer('Dealer1', 'D1', this.mesa);
        this.mesa.dealer = nuevoDealer;
        return nuevoDealer;
    }

    /**
     * @method retirarJugador
     * Método placeholder para la lógica de retirar un jugador de la mesa.
     * @returns {boolean} Falso (de momento).
     */
    retirarJugador() {
        // Lógica TO DO: Buscar el jugador en this.mesa.jugadores, removerlo y devolver su stack a su Cartera.
        return false;
    }

    /**
     * @method agregarJugador
     * Añade un jugador ya existente a la lista de jugadores de la mesa.
     * @param {Jugador} player - La instancia del Jugador a agregar.
     */
    agregarJugador(player) {
        this.mesa.jugadores.push(player);
    }

    /**
     * @method crearJugadores
     * Obtiene usuarios de la API del servidor y los añade a la mesa con posiciones iniciales.
     * @param {number} totalJugadores - Número máximo de jugadores a sentar (limita registros de API).
     * @returns {Promise<void>}
     */
    async crearJugadores(totalJugadores) {
        try {
            // Obtener usuarios desde la API
            const usuarios = await this.api.obtenerUsuarios();
            console.log(`✓ ${usuarios.length} usuario(s) obtenido(s) de la API`);

            // Limitar la cantidad de jugadores al total solicitado
            const jugadoresACargar = usuarios.slice(0, totalJugadores);

            // Iterar sobre los usuarios obtenidos de la API
            jugadoresACargar.forEach((usuario, indice) => {
                const posicion = this.posiciones[indice] || "UTG"; // Asigna posición o por defecto UTG
                
                // Crear instancia del Jugador con datos reales de la API
                console.log(`Añadiendo jugador: ${usuario.alias} (ID: ${usuario.id}) en posición ${posicion}`);
                this.agregarJugador(
                    new Jugador(
                        usuario.nombre + ' ' + usuario.apellidos, // Nombre completo
                        usuario.id, // ID real de la API
                        this.mesa,
                        posicion,
                        usuario.alias // Alias del usuario
                    )
                );
            });

            console.log(`✓ ${jugadoresACargar.length} jugador(es) añadido(s) a la mesa`);
        } catch (error) {
            console.error('✗ Error al crear jugadores desde la API:', error.message);
            throw error;
        }
    }
    
    /**
     * @method iniciarMano
     * Método central para empezar una nueva mano de póker.
     */
    async iniciarMano() {
        // 1. Rotar posiciones (BU, SB, BB).
        // 2. dealer.barajar().
        // 3. mesa.colocarCiegas().
        // 4. dealer.repartir(2).
        // 5. dealer.iniciarRondaApuestas(PRE_FLOP).
    }

    /**
     * @method iniciarJuego
     * Inicializa el flujo completo del juego.
     * Se ejecuta automáticamente después de crear la instancia.
     */
    async iniciarJuego() {
        try {
            // Cargar jugadores de la base de datos
            await this.crearJugadores(this.totalJugadores);

            // Barajar y quemar carta
            this.mesa.dealer.barajar();
            this.mesa.dealer.quemarCarta();

            // ENTREGA 2 CARTAS PERSONALES A CADA JUGADOR: 2 RONDAS DE 1 CARTA --> DE UNA EN UNA
            this.dealer.preflop = 'preflop';
            this.mesa.dealer.repartir(2);
            // 1a RONDAS DE APUESTAS (preflop)
            // this.dealer.darTurno();

            // ENTREGA 3 CARTAS COMUNITARIAS (FLOP)
            this.mesa.dealer.repartirFlop();
            // RONDA DE APUESTAS

            // ENTREGA 1 CARTA COMUNITARIA (TURN)
            this.mesa.dealer.repartirTurn();
            // RONDA DE APUESTAS

            // ENTREGA 1 CARTA COMUNITARIA (RIVER)
            this.mesa.dealer.repartirRiver();
            // RONDA DE APUESTAS

            // MOSTRAR GANADOR
            // REPARTIR POZO

            console.log('✓ Juego inicializado correctamente');
            console.log(this.mesa.dealer);
            console.log(this.mesa.jugadores);

            // Inyectamos las cartas comunitarias y los asientos de los jugadores en el HTML
            if (typeof document !== 'undefined') {
                const communityCardsEl = document.getElementById('community-cards');
                const playerSeatsEl = document.getElementById('player-seats-container');
                const mainPotEl = document.getElementById('main-pot-total');

                if (communityCardsEl) {
                    communityCardsEl.innerHTML = this.mesa.verCartasHTML();
                }
                if (playerSeatsEl) {
                    playerSeatsEl.innerHTML = this.mesa.verCartasJugadores();
                }
                if (mainPotEl) {
                    mainPotEl.innerHTML = this.mesa.amount;
                }
            }
        } catch (error) {
            console.error('✗ Error al iniciar el juego:', error.message);
        }
    }
}

/*
Sugerencia
! Eliminar this.posiciones	Elimina la propiedad this.posiciones del constructor de Pocker. En su lugar, impórtala directamente desde tu archivo config.js para usar la Única Fuente de Verdad y evitar duplicidad.
! Separación de Instanciación	La línea global const mesa = new Mesa('Mesa1', 0.0); al inicio es innecesaria y confusa, ya que la clase Pocker crea su propia mesa. Elimínala.

Añadir iniciarJuego()	Este método principal debe contener el game loop (bucle de juego). while (this.mesa.jugadores.length > 1) { this.iniciarMano(); }
Implementar rotarPosiciones()	La asignación de posiciones en crearJugadores es estática. Necesitas un método en Mesa o Pocker que llame a una función para rotar el botón (BU) y las ciegas (SB, BB) al comienzo de cada mano.

Asignación de Roles y BoteSugerenciaDetalleEstablecer Roles en crearJugadoresAl crear los jugadores, podrías asignarles inmediatamente los roles iniciales de Small Blind (SB) y Big Blind (BB) para la primera mano (si tienes 2 jugadores,
 por ejemplo).Vincular el Bote a la MesaAsegúrate de que la clase Mesa tiene la referencia al Pozo (this.pozo) y que cualquier acción de apuesta pasa por la Mesa antes de llegar al Pozo, lo que te dará más control para manejar los side pots (botes secundarios).
*/

export default Pocker;