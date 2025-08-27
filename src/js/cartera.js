class Cartera {

	constructor(amount) {
		this.saldoEnCuenta = amount; // TODO EL DINERO DEL JUGADOR
		this.dineroEnMesa = 0;
	} 

	/*
        1. saldoEnCuenta --> 
        2. dineroEnMesa --> 
        3. saldoTotal = saldo en cuenta + dinero en mesa

	*/
	
	get saldoTotal(){
		return this.saldoEnCuenta + this.dineroEnMesa;
	}

	agregarFondos(monto) {
		/* Agregar saldo a la cuenta */

		this.saldoEnCuenta += monto;
	}

	apostarDinero(monto) {
		/* 
		*/
		if (monto > this.saldoEnCuenta) {
			console.log("Fondos insuficientes");
			return false;
		}
		this.saldoEnCuenta -= monto;
		this.dineroEnMesa += monto;
		return true;
	}

}

export default Cartera;


