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
        return false;
    }

    repartirFlop(){
        /* Coloca 3 cartas comunitarias en la mesa 
        for (let i = 0; i < 3; i++) {
            this.mesa.cartas.push(this.baraja.cartas.pop());
        } 
        añadirlas a la variable cartas comunitarias y eliminarlas del mazo 
        
        */
    }

    repartirTurn(){
        /* Coloca 1 carta comunitaria en la mesa 
        this.mesa.cartas.push(this.baraja.cartas.pop()); */
    }

    repartirRiver(){
        /* Coloca 1 carta comunitaria en la mesa 
        this.mesa.cartas.push(this.baraja.cartas.pop()); */
    }

    repartirBoard(){
        /* Reparte las 5 cartas comunitarias en la mesa */
        this.repartirFlop();
        this.repartirTurn();
        this.repartirRiver();
    }   


    entregaComunitarias(total_comunitarias){

        /* Coloca N cartas comunitarias en la mesa, util para pruebas*/
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