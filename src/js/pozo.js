class Pozo {
	constructor(amount) {
		this.amount = amount;
	} 
	
	agregarFondos(amount) {
		this.amount += amount;
	}

	retirarFondos(amount) {
		if (amount > this.amount) {
			console.log("Fondos insuficientes");
			return false;
		}
		this.amount -= amount;
		this.saldoEnMesa += amount;
		return true;
	}

	verFondos() {
		return this.amount;
	}	
}

export default Pozo;


/*

pozoTotal = 0;
*/