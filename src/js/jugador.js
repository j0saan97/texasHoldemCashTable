class Jugador {
	constructor(nombre, codigo) {
		this.name = nombre;
        this.codigo = codigo;
        this.cartas = [];
        this.activo = true;
	}

    jugarCarta(){
        return false;
    }

    apostarDinero(){
        return false;
    }

    checkear(){
        return false;
    }

    resubir(){
        return false;
    }

    foldear(){
        // se retira de los jugadores que optan al bote, no puede reaizar mas acciones hasta la siguiente mano
        return false;
    }

    verCartas(){
        if (this.cartas.length === 0) {
            console.log("No tienes cartas.");
        } else {
            const cartasStr = this.cartas.map(carta => `${carta.valor} de ${carta.palo}` ).join(', ');
            console.log(`Tus cartas: ${cartasStr}`);
        }
    }
}

export default Jugador;