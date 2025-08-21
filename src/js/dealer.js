import Baraja from './baraja.js';

class Dealer {
    constructor(name, codigo) {
        this.name = name;
        this.codigo = codigo;
        //this.baraja
        //this.mesa
    }

    di_hola(){
        console.log('Hola jugadores');
    }
    
    entregaComunitarias(total_comunitarias){
        /* Coloca N cartas comunitarias en la mesa indicada */
        for (let i = 0; i < total_comunitarias; i++) {
            this.mesa.cartas.push(this.baraja.cartas.pop());
        }
    }

    // repartir las 2 cartas de 1 en 1, es decir en 2 rondas
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