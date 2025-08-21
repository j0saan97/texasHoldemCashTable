class Carta {
	constructor(palo, valor) {
		this.palo = palo;
        this.valor = valor
        this.image_url = `./src/images/cartas/${valor}${palo}.png`;  
	}

    mostrarCartaHTML() {
        return `<div class="card-container">
                    <img src="${this.image_url}" alt="Carta de póker">
                </div>`;
    }
    
    verCarta(){
        console.log(`${this.valor} de ${this.palo}`)
    }
}
 
export default Carta;