class Carta {
	constructor(palo, valor) {
		this.palo = palo;
        this.valor = valor;
        this.image_url = `https://deckofcardsapi.com/static/img/${this.valor}${this.palo}.png`;
	}

    verCartaHTML() {
        return `<div class="item-carta">
                    <img src="${this.image_url}" alt="${this.valor} de ${this.palo}" class="carta-img" />
                </div>`;
    }
}

export default Carta;