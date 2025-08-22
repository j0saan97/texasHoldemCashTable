import Dealer from "./dealer.js";

class Mesa {
	constructor(codigo, amount) {
		this.amount = amount;
        this.codigo = codigo;
        this.cartas = [];
        this.jugadores = [];
        this.dealer = null;
	}

    verCartasHTML() {
        if (this.cartas.length === 0) {
            return `<div>
                        <span>No hay cartas en la mesa</span>
                    </div>`;
        } else {
            // Genera el HTML de todas las cartas en la mesa
            return `<div class="cartas-mesa">
                        ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                    </div>`;
        }
    }

}

export default Mesa;