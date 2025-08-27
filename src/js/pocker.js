import Mesa from "./mesa.js";
import Dealer from "./dealer.js";
import Jugador from "./jugador.js";

const mesa = new Mesa('Mesa1', 0.0);

class Pocker {
    constructor(totalJugadores = 4) {
        this.mesa = this.crearMesa();
        this.dealer = this.crearDealer();
        this.posiciones = ["UTG", "MP", "CU", "BU", "SB", "BB"];
        this.crearJugadores(totalJugadores);
    }

    crearMesa() {
        return new Mesa('Mesa1', 0.0);
    }

    crearDealer() {
        /* Asigna un dealer a la mesa y retorna la referencia del dealer */
        this.mesa.dealer = new Dealer('Dealer1', 'D1', this.mesa);
        return this.mesa.dealer;
    }

	retirarJugador(){
		/* Retira un jugador de la mesa */
		return false;
	}

    agregarJugador(player){
		/* Agrega un nuevo jugador a la mesa */
		this.mesa.jugadores.push(player);
	}

    crearJugadores(total) {
		/* Crea y agrega jugadores a la mesa */
        for (let i = 1; i <= total; i++) {
			this.agregarJugador(new Jugador(`Jugador${i}`, i, this.mesa, this.posiciones[i-1]));
        }
    }
}

export default Pocker;