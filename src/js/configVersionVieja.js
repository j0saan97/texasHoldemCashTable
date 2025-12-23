/**
 * @fileoverview Archivo de configuración centralizada para el juego Texas Hold'em.
 * Contiene todas las constantes y valores por defecto necesarios para la lógica del juego.
 * @module config
 */

// --- CONFIGURACIÓN DE MANOS Y RANKING ---

/**
 * @constant {Object<number, string>} RANKING_MANOS
 * Mapeo del ranking de las manos de póker del 1 (la mejor) al 10 (la peor, Carta Alta).
 * Crucial para la lógica del evaluador de manos (Hand Evaluator).
 * NOTA: El orden 1-10 es inverso al valor numérico típico (donde 1 es Carta Alta).
 */
export const RANKING_MANOS = {
  1: "Escalera Real",     // Royal Flush (A, K, Q, J, T del mismo palo)
  2: "Escalera de Color", // Straight Flush (Cinco cartas consecutivas del mismo palo)
  3: "Póker",             // Four of a Kind (Cuatro cartas del mismo valor)
  4: "Full House",        // Full House (Trío + Par)
  5: "Color",             // Flush (Cinco cartas del mismo palo)
  6: "Escalera",          // Straight (Cinco cartas consecutivas)
  7: "Trío",              // Three of a Kind (Tres cartas del mismo valor)
  8: "Doble Par",         // Two Pair (Dos pares de cartas)
  9: "Par",               // One Pair (Un par de cartas)
  10: "Carta Alta"        // High Card (Ninguna de las anteriores)
};

/**
 * @constant {string[]} POSICIONES
export const POSICIONES = ["UTG", "MP", "CU", "BU", "SB", "BB"];

/**
 * @constant {string[]} ORDEN_ACCION_PREFLOP
 * Define el orden en que los jugadores actúan en la ronda PRE-FLOP. La acción comienza después de la Big Blind (BB), en UTG.*/
export const ORDEN_ACCION_PREFLOP = ["UTG", "MP", "CU", "BU", "SB", "BB"];

/**
 * @constant {string[]} ORDEN_ACCION_POSTFLOP
 * Define el orden en que los jugadores actúan en las rondas POST-FLOP (Flop, Turn, River).La acción comienza siempre por la Small Blind (SB) o el primer jugador activo a su izquierda.*/
export const ORDEN_ACCION_POSTFLOP = ["SB", "BB", "UTG", "MP", "CU", "BU"];

// --- CONFIGURACIÓN DE LÍMITES Y TIEMPOS ---

/**
 * @constant {Object} DEFAULT_BLINDS
 * Valores monetarios por defecto para las ciegas de la mesa de cash.
 */
export const DEFAULT_BLINDS = { 
  smallBlind: 0.5, // Valor de la Ciega Pequeña (SB)
  bigBlind: 1,     // Valor de la Ciega Grande (BB)
  ante: 0.1     // Opcional: El 'ante' por jugador, si fuera necesario (descomentar si se usa).
};

/**
 * @constant {Object} DEFAULT_BUYIN
 * Límites de dinero que un jugador puede llevar a la mesa (Buy-in).Se suele definir en múltiplos de la Big Blind. (40BB a 100BB en este ejemplo).*/
export const DEFAULT_BUYIN = { min: 40, max: 100 };

/**
 @constant {number} MAX_PLAYERS
 * Número máximo de jugadores permitidos en la mesa (6 para 6-max).*/
export const MAX_PLAYERS = 6;

/** @constant {number} MIN_PLAYERS Número mínimo de jugadores permitidos en la mesa (4 para iniciar la partida).*/
export const MIN_PLAYERS = 4;
 

/**
 * @constant {number} TIME_PER_TURN_MS
 * Tiempo límite (en milisegundos) que un jugador tiene para tomar una decisión.
 */
export const TIME_PER_TURN_MS = 30000; // 30 segundos (configurable)

// --- CONFIGURACIÓN DE CARTAS Y VALORES ---

/**
 * @constant {string[]} RANKS
 * Lista de los rangos o valores de las cartas, usando notación corta (T para 10).*/
export const RANKS = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];

/**
 * @constant {string[]} SUITS
 * Lista de los palos de las cartas, usando notación corta.
 * s: Spades (Picas), h: Hearts (Corazones), d: Diamonds (Diamantes), c: Clubs (Tréboles).
 */
export const SUITS = ['s','h','d','c'];

/**
 * @constant {Object<string, number>} RANK_VALUE
 * Mapeo de los rangos de cartas a su valor numérico real.
 * Necesario para ordenar y evaluar las manos (ej. A=14, K=13, J=11).
 */
export const RANK_VALUE = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};


export const GAME_PHASES = {
    // Fase simple
    preflop: 'PREFLOP', // O un objeto si necesitas más detalles

    // Contenedor que agrupa las sub-fases de postflop
    postflop: {
        flop: 'FLOP',
        turn: 'TURN',
        river: 'RIVER',
        showdown: 'SHOWDOWN'
    }
};

const ConfiguracionJuego ={
  RANKING_MANOS,
  POSICIONES,
  ORDEN_ACCION_PREFLOP,
  ORDEN_ACCION_POSTFLOP,
  DEFAULT_BLINDS,
  DEFAULT_BUYIN,
  MAX_PLAYERS,
  MIN_PLAYERS,
  TIME_PER_TURN_MS,
  RANKS,
  SUITS,
  GAME_PHASES,
  RANK_VALUE
};

// La nota que dejaste es muy acertada: centralizar esto permite cargar distintos configs para variantes de juego (MTT, Sit & Go, etc.)