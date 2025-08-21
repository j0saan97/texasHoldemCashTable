class Mesa {
	constructor(codigo, amount) {
		this.amount = amount;
        this.codigo = codigo;
        this.cartas = [];
        this.jugadores = [];
	}

    verCartas(){
        if (this.cartas.length === 0) {
            console.log("No tienes cartas.");
        } else {
            const cartasStr = this.cartas.map(carta => `${carta.valor} de ${carta.palo}` ).join(', ');
            console.log(`Cartas en la mesa: ${cartasStr}`);
        }
    }
}

export default Mesa;