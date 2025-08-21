import Mesa from "./mesa.js";
import Dealer from "./dealer.js";
import Jugador from "./jugador.js";

const mesa = new Mesa('Mesa1', 0.0);

class TexasHoldemPocker {
    constructor(totalJugadores = 4) {
        this.mesa = this.crearMesa();
        this.dealer = this.crearDealer();
        this.crearJugadores(totalJugadores);
		console.log(this.mesa);
		console.log(this.dealer);
    }

    crearMesa() {
        return new Mesa('Mesa1', 0.0);
    }

    crearDealer() {
        return new Dealer('Dealer1', 'D1');
    }

	agregarJugador(persona){
		/* Agrega un nuevo jugador a la mesa */
		this.mesa.jugadores.push(persona);
	}

	retirarJugador(){
		/* Retira un jugador de la mesa */
		return false;
	}

    crearJugadores(total) {
		/* Crea y agrega jugadores a la mesa */
        for (let i = 1; i <= total; i++) {
			this.agregarJugador(new Jugador(`Jugador${i}`, i));
        }
    }
}

export default TexasHoldemPocker;