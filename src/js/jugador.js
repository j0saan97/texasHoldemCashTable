import Cartera from "./cartera.js";


class Jugador {

	constructor(nombre=null, codigo=null, mesa=null, posicion=null ) {
        this.cartera = new Cartera(1000); // cada jugador empieza con 1000 de dinero
		this.nombre = nombre;
        this.codigo = codigo;
        this.cartas = [];
        this.activo = true;
        this.mesa = mesa;
        this.posicion = posicion;
	}

    igualar(){

    }

    foldear(){

    }
    
    apostarDinero(amount){
        this.mesa.apostarDinero(amount);
        this.cartera.apostarDinero(amount);
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