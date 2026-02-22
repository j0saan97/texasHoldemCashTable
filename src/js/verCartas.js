
verCartas() {
        if (this.cartas.length === 0) {
            console.log("No tienes cartas.");
        } else {
            // Utiliza el método verCartaHTML() de la clase Carta para cada carta.
            return `
                <div id="player-${this.codigo}" class="player-seat seat-${this.codigo}">
                    <!-- Contenedor principal de info del jugador -->
                    <div class="player-info-card relative p-2">
                        <!-- Icono/Avatar del jugador -->
                        <div class="flex flex-row items-center">
                            <div class="w-10 h-10 bg-gray-600 rounded-full mb-1 flex items-center justify-center text-xl text-white border-2 border-gray-400">
                                ${this.ciegaActual} 
                            </div>
                            <div class="w-10 h-10 mb-1 flex items-center justify-center text-xl text-white">
                                ${this.ciegaActual === 'BB' ? this.stakeBB + '€' : this.ciegaActual === 'SB' ? this.stakeSB + '€' : this.stakeAntes + '€'}
                            </div>
                        </div>

                        <!-- Stack y nombre -->
                        <!-- Cartas (Ocultas/Cerradas) -->
                        <div class="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex gap-1">
                            ${this.cartas.map(carta => carta.verCartaHTML()).join('')}
                        </div>
                        <div class="flex flex-col items-center" style="margin-top:10px">
                            <div class="flex items-center gap-4" id="user_controls_${this.codigo}">

                                <!-- Slider de apuesta y botones de acción -->
                                <div>
                                    <div class="flex-grow flex items-center gap-2" style="min-width:150px">
                                        <input type="range" min="0" max="${this.cartera.saldoEnCuenta}" value="${this.cartera.saldoEnCuenta}" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                                        <input type="number" value="${this.cartera.saldoEnCuenta}" class="bg-blue-600 text-white font-bold w-20 py-1 text-center rounded-lg focus:outline-none">
                                    </div>
                                </div>

                                <!-- Botones de acción del jugador -->
                                <div class="flex flex-row gap-1" style="width: 100%; overflow: hidden;">
                                    <button id="btn-nombre-${this.codigo}" class="btn btn-sm btn-info text-truncate" style="flex: 1; min-width: 0;">
                                        ${this.nombre}
                                    </button>

                                    <button class="btn btn-sm btn-success" style="flex: 1; max-height: 30px; min-width: 0;" onclick="window.apostarJugador?.('${this.codigo}')">
                                        Apostar
                                    </button>
                                    
                                    <button class="btn btn-sm btn-info" style="flex: 1; max-height: 30px; min-width: 0;" onclick="window.igualarJugador?.('${this.codigo}')">
                                        Igualar
                                    </button>
                                    
                                    <button class="btn btn-sm btn-danger" style="flex: 1; max-height: 30px; min-width: 0;" onclick="window.foldearJugador?.('${this.codigo}')">
                                        Fold
                                    </button>
                                    
                                    <button class="btn btn-sm btn-secondary" style="flex: 1; max-height: 30px; min-width: 0;" onclick="window.chequearJugador?.('${this.codigo}')">
                                        Check
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
        }
    }