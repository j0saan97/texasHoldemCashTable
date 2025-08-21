export const RANKING_MANOS = {
  1: "Escalera Real",
  2: "Escalera de Color",
  3: "Póker",
  4: "Full House",
  5: "Color",
  6: "Escalera",
  7: "Trío",
  8: "Doble Par",
  9: "Par",
  10: "Carta Alta"
};

export const POSICIONES = ["UTG", "MP", "CU", "BU", "SB", "BB"]; // 6-max
export const ORDEN_ACCION_PREFLOP = ["UTG", "MP", "CU", "BU", "SB", "BB"];
export const ORDEN_ACCION_POSTFLOP = ["SB", "BB", "UTG", "MP", "CU", "BU"];

export const DEFAULT_BLINDS = { 
  small: 0.5, 
  big: 1, 
  ante: 0.1 // por jugador
};

export const DEFAULT_BUYIN = { min: 40, max: 100 };
export const MAX_PLAYERS = 6;
export const TIME_PER_TURN_MS = 30000; // configurable

export const RANKS = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
export const SUITS = ['s','h','d','c'];

export function generarBaraja() {
  return SUITS.flatMap(s => RANKS.map(r => `${r}${s}`));
}

export const RANK_VALUE = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
  '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export default {
  RANKING_MANOS,
  POSICIONES,
  ORDEN_ACCION_PREFLOP,
  ORDEN_ACCION_POSTFLOP,
  DEFAULT_BLINDS,
  DEFAULT_BUYIN,
  MAX_PLAYERS,
  TIME_PER_TURN_MS,
  RANKS,
  SUITS,
  generarBaraja,
  RANK_VALUE
};

// Nota: con esto tendrías todas las constantes centralizadas. Si más adelante creas variantes (MTT, Spin&Go), podrías cargar distintos config por tipo de torneo.









