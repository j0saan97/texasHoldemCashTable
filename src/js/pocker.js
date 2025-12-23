import Mesa from "./mesa.js";     // Importa la clase Mesa (el contenedor principal).
import Dealer from "./dealer.js"; // Importa la clase Dealer (el gestor del juego).
import Jugador from "./jugador.js"; // Importa la clase Jugador.

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
        
        // Crea las instancias de Jugador y las sienta en la mesa.
        this.crearJugadores(totalJugadores);
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
     * Crea y añade un número específico de jugadores a la mesa, asignándoles posiciones iniciales.
     * @param {number} total - Número de jugadores a crear.
     */
    crearJugadores(total) {
        // Itera para crear 'total' jugadores.
        for (let i = 1; i <= total; i++) {
            // Se crea el Jugador con su nombre, código, referencia a la mesa y la posición inicial.
            console.log(this.posiciones[i-1]);
            this.agregarJugador(
                new Jugador(
                    `Jugador${i}`, 
                    i, 
                    this.mesa, 
                    this.posiciones[i-1], // Asigna posiciones secuencialmente.
                    // asigna el valor de this.posiciones[i-1] a
                    this.ciegaActual = this.posiciones[i-1]
                )
            );
        }
        // NOTA: Esta asignación de posición es fija. En el juego real, las posiciones deben rotar cada mano.
    }
    
    /**
     * @method iniciarMano
     * Método central para empezar una nueva mano de póker.
     */
    iniciarMano() {
        // 1. Rotar posiciones (BU, SB, BB).
        // 2. dealer.barajar().
        // 3. mesa.colocarCiegas().
        // 4. dealer.repartir(2).
        // 5. dealer.iniciarRondaApuestas(PRE_FLOP).
    }
}

export default Pocker;

/*
Sugerencia
! Eliminar this.posiciones	Elimina la propiedad this.posiciones del constructor de Pocker. En su lugar, impórtala directamente desde tu archivo config.js para usar la Única Fuente de Verdad y evitar duplicidad.
! Separación de Instanciación	La línea global const mesa = new Mesa('Mesa1', 0.0); al inicio es innecesaria y confusa, ya que la clase Pocker crea su propia mesa. Elimínala.

Añadir iniciarJuego()	Este método principal debe contener el game loop (bucle de juego). while (this.mesa.jugadores.length > 1) { this.iniciarMano(); }
Implementar rotarPosiciones()	La asignación de posiciones en crearJugadores es estática. Necesitas un método en Mesa o Pocker que llame a una función para rotar el botón (BU) y las ciegas (SB, BB) al comienzo de cada mano.

Asignación de Roles y BoteSugerenciaDetalleEstablecer Roles en crearJugadoresAl crear los jugadores, podrías asignarles inmediatamente los roles iniciales de Small Blind (SB) y Big Blind (BB) para la primera mano (si tienes 2 jugadores,
 por ejemplo).Vincular el Bote a la MesaAsegúrate de que la clase Mesa tiene la referencia al Pozo (this.pozo) y que cualquier acción de apuesta pasa por la Mesa antes de llegar al Pozo, lo que te dará más control para manejar los side pots (botes secundarios).
*/