import palos from "./palos.js";
import valores from "./valores.js";
import Carta from "./carta.js";

class Baraja{

    constructor() {
        this.cartas = this.desempacar();
        this.barajar();
    }

    barajar(){
        // Mezclamos las cartas aleatoriamente con el algoritmo Fisher-Yates
        for (let i = this.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
        }
    }

    desempacar() {
        const cartas = [];
        const listaPalos = palos();
        const listaValores = valores();

        // Crea combinaciones de cartas, asocia cada palo con todos los valores disponibles
        for (const palo of listaPalos) {
            for (const valor of listaValores) {
                cartas.push(new Carta(palo, valor));
            }
        }
        return cartas;
    }
}

export default Baraja;