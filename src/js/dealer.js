import Baraja from './baraja.js';

class Dealer {
    constructor(name = null, codigo = null, mesa = null) {
        this.nombre = name;
        this.codigo = codigo;
        this.mesa = mesa;
        this.baraja = this.usarBaraja();
    }

    usarBaraja(){
        /* Toma una baraja */
        return new Baraja();
    }

    barajar(){
        // Mezclamos las cartas aleatoriamente con el algoritmo Fisher-Yates
        for (let i = this.baraja.cartas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.baraja.cartas[i], this.baraja.cartas[j]] = [this.baraja.cartas[j], this.baraja.cartas[i]];
        }
    }

    entregaComunitarias(total_comunitarias){
        /* Coloca N cartas comunitarias en la mesa */
        for (let i = 0; i < total_comunitarias; i++) {
            this.mesa.cartas.push(this.baraja.cartas.pop());
        }
    }

    repartir(jugadores, cartasPorJugador = 2) {
        for (const jugador of jugadores) {
            for (let i = 0; i < cartasPorJugador; i++) {
                jugador.cartas.push(this.baraja.cartas.pop());
            }
        }
        return true;
    
    }
}

export default Dealer;