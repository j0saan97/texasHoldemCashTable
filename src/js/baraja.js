import palos from "./palos.js";   // Importa la función que proporciona la lista de palos (ej. 'Corazones', 'Picas', etc.).
import valores from "./valores.js"; // Importa la función que proporciona la lista de valores de cartas (ej. '2', '3', 'A', etc.).
import Carta from "./carta.js";     // Importa la clase base 'Carta' para crear instancias de cartas individuales.

/**
 * @class Baraja
 * @description Representa una baraja estándar de 52 cartas de póker.
 * Contiene métodos para crear y, posteriormente, barajar y repartir cartas.
 */
class Baraja {

    /**
     * @constructor
     * Inicializa la baraja y la llena inmediatamente con las 52 cartas estándar.
     */
    constructor() {
        // Inicializa la propiedad 'cartas' con el array resultante del método 'crear()'.
        this.cartas = this.crear();
    }

    /**
     * @method crear
     * Crea y devuelve un array con las 52 instancias de la clase Carta.
     * Asocia cada palo disponible con cada valor disponible.
     * @returns {Carta[]} Un array que contiene todas las cartas de la baraja.
     */
    crear() {
        const cartas = [];                 // Array vacío donde se almacenarán las 52 cartas.
        const listaPalos = palos();        // Obtiene el array de los 4 palos.
        const listaValores = valores();    // Obtiene el array de los 13 valores (2-A).

        // Itera sobre cada palo disponible.
        for (const palo of listaPalos) {
            // Para cada palo, itera sobre cada valor disponible.
            for (const valor of listaValores) {
                // Crea una nueva instancia de Carta con la combinación actual (palo y valor)
                // y la añade al array de cartas.
                cartas.push(new Carta(palo, valor));
            }
        }
        
        // El array final contiene 52 objetos Carta.
        return cartas;
    }
}

export default Baraja; // Exporta la clase Baraja para que pueda ser utilizada en otros módulos.