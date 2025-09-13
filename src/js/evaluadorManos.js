class evaluadorManos {
    #mano = null
    #rangoMano = null
    
    constructor() {
    }
    
    get mano(){
        return this.mano;
    }

    /**
     * Evalúa si la mano es una Escalera Real.
     * @returns {boolean}
     */
    esEscaleraReal() {
        const escalerasRealesPosibles = [
    ['0D', 'JD', 'QD', 'KD', 'AD'],
    ['0H', 'JH', 'QH', 'KH', 'AH'],
    ['0C', 'JC', 'QC', 'KC', 'AC'],
    ['0S', 'JS', 'QS', 'KS', 'AS']
];
    // if el array(formado por el board y las 2 cartas de cada jugador) que le llega a esta función contiene alguna de las escaleras reales posibles, jugador.rangoMano = "Escalera Real"
        return false;
    }

    esEscaleraDeColor() {
        /*1.- hacemos un split del array y lo ordenamos con sort en orden ascendente
        2.- comprobamos en orden descendente si hay 5 cartas consecutivas del mismo palo.el orden descendente es para que el programa escoja la escalera de color mas alta posible
        3.- si las hay, jugador.rangoMano = "Escalera de Color"
        */
        return false;
    }


    esPoker() {
        // recorremos el array y contamos cuantas cartas hay de cada valor, si hay 4 iguales, jugador.rangoMano = "Poker"
    }

    esFullHouse() {
        /* 1.- ordenamos el array y comprobamos si hay un trío o 2
        2.- si hay 2 trios, nos quedamos con el mas alto y buscamos una pareja con las cartas restantes del array
        3.- si existeTrio y hay pareja, jugador.rangoMano = "Full House" 
        */
       return false;
    }

    
    esColor() {
        /* 1.-ordenamos el array en sentido descendente --> para que se quede con el color mas alto posible
           2.- iteramos sobre él, si hay 5 cartas del mismo palo, jugador.rangoMano = "Color"
        */
        return false;
    }

    esEscalera() {
        // ordenamos el array en sentido descendente y comprobamos si hay 5 cartas consecutivas, si las hay, jugador.rangoMano = "Escalera"
        return false;
    }

    
    esTrio() {
        /*1.- iteramos sobre todo el array despues de ordenarlo de mayor a menor
        2.- si hay 3 cartas del mismo valor, jugador.rangoMano = "Trío"
         **3.- si hay 2 trios, nos quedamos con el que tenga el valor mas alto... si iteramos sobre el array ordenado en orden descendente no hace falta comprobar si hay otro tio
        porque ya nos quedamos con el mas alto
        */
       return false;
    }

    esDoblePareja() {
        /*1.- ordenamos de mayor a manor
          2.- si hay 2 cartas con el mismo valor las añadimos a un array doblesParejas
          3.- seguimos iterando buscando otro pair mas, si lo hay, se añade a doblesParejas 
          4.- logica parra determinar que unas dobles parejas pueden ser mas altas que otra*/
        return false;
    }

    /**
     * Evalúa si la mano es una Pareja.
     * @returns {boolean}
     */
    esPareja() {
        // Lógica para determinar si es una pareja
        return false;
    }

    /**
     * Evalúa si la mano es una Carta Alta.
     * @returns {boolean}
     */
    esCartaAlta() {
        // Lógica para determinar si es una carta alta
        return false;
    }

    checkearManosIguales(){
        /**
     * Método principal para evaluar la mano completa.
     * Devolverá el rango de la mano.
     */
    }
    

    
    evaluarMano() {
        if (this.esEscaleraReal()) {
            this.rangoMano = "Escalera Real";
        } else if (this.esEscaleraDeColor()) {
            this.rangoMano = "Escalera de Color";
        } else if (this.esPoker()) {
            this.rangoMano = "Poker";
        } else if (this.esFullHouse()) {
            this.rangoMano = "Full House";
        } else if (this.esColor()) {
            this.rangoMano = "Color";
        } else if (this.esEscalera()) {
            this.rangoMano = "Escalera";
        } else if (this.esTrio()) {
            this.rangoMano = "Trío";
        } else if (this.esDoblePareja()) {
            this.rangoMano = "Doble Pareja";
        } else if (this.esPareja()) {
            this.rangoMano = "Pareja";
        } else {
            this.rangoMano = "Carta Alta";
        }
        return this.rangoMano;
    }
} 

export default evaluadorManos;