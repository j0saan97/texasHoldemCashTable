import palos from "./palos.js";
import valores from "./valores.js";
import Carta from "./carta.js";

class Baraja{

    constructor() {
        this.cartas = this.crear();
    }

    crear() {
        /*
        Llena la baraja con las combinaciones de cartas, asocia cada palo con 
        todos los valores disponibles
        */

        const cartas = [];
        const listaPalos = palos();
        const listaValores = valores();

        for (const palo of listaPalos) {
            for (const valor of listaValores) {
                cartas.push(new Carta(palo, valor));
            }
        }
        return cartas;
    }
}

export default Baraja;