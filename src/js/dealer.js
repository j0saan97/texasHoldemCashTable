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

    quemarCarta(){
        // quema una carta del mazo mostrandola boca abajo en el tapete, usar el css de la API que tiene cartas boca abajo
        this.baraja.cartas.pop();
    }

    repartirFlop(){
        this.repartirComunitarias(3);

    }

    repartirTurn(){
        this.repartirComunitarias(1);
    }

    repartirRiver(){
        this.repartirComunitarias(1);
    }

    repartirBoard(){
        /* Reparte las 5 cartas comunitarias en la mesa */
        this.repartirFlop();
        this.repartirTurn();
        this.repartirRiver();
    }   


    repartirComunitarias(total_comunitarias){

        /* Coloca N cartas comunitarias en la mesa, util para pruebas*/
        for (let i = 0; i < total_comunitarias; i++) {
            this.mesa.cartas.push(this.baraja.cartas.pop());
        }
    }

    repartir(cartasPorJugador = 2) {
        for (let i = 0; i < cartasPorJugador; i++) { 
            for (const jugador of this.mesa.jugadores) {
                jugador.cartas.push(this.baraja.cartas.pop());
            }
        }
    }
}

export default Dealer;