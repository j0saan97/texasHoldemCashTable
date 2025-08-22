class Jugador {
	constructor(nombre=null, codigo=null, mesa=null) {
		this.nombre = nombre;
        this.codigo = codigo;
        this.cartas = [];
        this.activo = true;
        this.mesa = mesa;
	}

    pedirCarta(){
        return false;
    }

    rechazarCarta(){
        return false;
    }

    jugarCarta(){
        return false;
    }

    apostarDinero(){
        return false;
    }

    retirarseDeMesa(){
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