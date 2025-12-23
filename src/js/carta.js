/**
 * @class Carta
 * @description Representa una carta individual en la baraja de póker,
 * incluyendo su palo, valor y la URL para su representación visual.
 */
class Carta {
    /**
     * @constructor
     * Crea una instancia de Carta.
     * @param {string} palo - El palo de la carta (ej. 'Corazones', 'Picas').
     * @param {string} valor - El valor de la carta (ej. 'A', 'K', '7').
     */
    constructor(palo, valor) {
        // Almacena el palo de la carta.
        this.palo = palo; 
        
        // Almacena el valor nominal de la carta.
        this.valor = valor; 
        
        // Construye la URL de la imagen de la carta utilizando la API de Deck of Cards.
        // Asume que la combinación palo+valor (ej. 'KH' para Rey de Corazones) forma el nombre del archivo.
        this.image_url = `https://deckofcardsapi.com/static/img/${this.valor}${this.palo}.png`;
    }

    /**
     * @method verCartaHTML
     * Genera y devuelve la representación HTML de la carta para ser insertada en el DOM.
     * @returns {string} Una cadena de texto HTML que contiene la estructura y la imagen de la carta.
     */
    verCartaHTML() {
        return `<div class="item-carta">
                    <img src="${this.image_url}" alt="${this.valor} de ${this.palo}" class="carta-img" />
                </div>`;
    }
}

export default Carta; // Hace que la clase Carta esté disponible para otros módulos.