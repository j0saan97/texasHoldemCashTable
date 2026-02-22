 
    verCartas() {
    if (!this.cartas || this.cartas.length === 0) {
        console.log("No tienes cartas.");
        return ``;
    }

    // Lógica de dinero simplificada
    const dineroAMostrar = this.ciegaActual === 'BB' ? this.stakeBB : 
                          this.ciegaActual === 'SB' ? this.stakeSB : 
                          (this.stakeAntes || 0);

    return `
        <div id="player-${this.codigo}" class="player-seat seat-${this.codigo}" style="max-width: 100%;">
            <div class="player-info-card relative p-2" style="display: flex; flex-direction: column; align-items: center;">
                
                <div class="flex flex-row items-center gap-2 mb-2">
                    <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white border-2 border-gray-400 font-bold">
                        ${this.ciegaActual || '—'} 
                    </div>
                    <div class="bg-black/50 px-2 py-1 rounded text-sm text-yellow-400 font-bold">
                        ${dineroAMostrar}€
                    </div>
                </div>

                <div class="flex gap-1 mb-2" style="justify-content: center;">
                    ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                </div>

                <div id="user_controls_${this.codigo}" class="flex flex-col gap-2 w-full" style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px;">
                    
                    <div class="flex flex-wrap items-center gap-2 justify-center w-full">
                        <input type="range" min="0" 
                            max="${this.cartera?.saldoEnCuenta || 0}" 
                            value="${this.cartera?.saldoEnCuenta || 0}" 
                            class="flex-grow h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" 
                            style="min-width: 80px;">
                        
                        <input type="number" 
                            value="${this.cartera?.saldoEnCuenta || 0}" 
                            class="bg-blue-600 text-white font-bold w-16 py-1 text-center rounded text-sm focus:outline-none">
                    </div>

                    <div class="flex flex-row gap-1 w-full" style="overflow: hidden;">
                        <button id="btn-nombre-${this.codigo}" class="btn btn-xs btn-info text-truncate" style="flex: 1; min-width: 0; font-size: 10px;">
                            ${this.nombre}
                        </button>

                        <button class="btn btn-xs btn-success" style="flex: 1; min-width: 0; font-size: 10px;" onclick="window.apostarJugador?.('${this.codigo}')">
                            Apostar
                        </button>
                        
                        <button class="btn btn-xs btn-info" style="flex: 1; min-width: 0; font-size: 10px;" onclick="window.igualarJugador?.('${this.codigo}')">
                            Igualar
                        </button>
                        
                        <button class="btn btn-xs btn-danger" style="flex: 1; min-width: 0; font-size: 10px;" onclick="window.foldearJugador?.('${this.codigo}')">
                            Fold
                        </button>
                        
                        <button class="btn btn-xs btn-secondary" style="flex: 1; min-width: 0; font-size: 10px;" onclick="window.chequearJugador?.('${this.codigo}')">
                            Check
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}