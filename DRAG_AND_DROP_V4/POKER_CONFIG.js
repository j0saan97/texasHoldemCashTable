const POKER_CONFIG = {
    // 1. Estructura Jerárquica del Juego
    modalidades: {
        'NoLimitHoldem': {
            'MTT': {
                subtipos: ['vanilla (sin bounty)', 'PKO', 'MisteryBounty', 'Hyper_PKO', 'Hyper_vanilla'],
                niveles: [2, 5, 10, 25, 50, 100, 200, 400, 600, 1000] // NivelTorneo (Enteros sin decimales)
            },
            'CASH_GAME': {
                subtipos: ['6Max - SIN ANTE', '6Max - CON ANTE', '9max - SIN ANTE', '9max - CON ANTE', '9max - 200bb', '9max - 100bb', 'ZOOM'],
                niveles: ["NL2", "NL5", "NL10", "NL25", "NL50", "NL100", "NL200", "NL400", "NL600", "NL1000"] // NivelMesa
            },
            'SPIN_AND_GO': {
                subtipos: ['velocidad_normal', 'NITRO'],
                niveles: [0.25, 1, 2, 5, 10, 25, 50, 100] // Opciones estándar de Spins
            }
        },
        'PotLimitOmaha': {
            'CASH_GAME': {
                subtipos: ['PLO 6Max', 'PLO 9Max', 'PLO ZOOM'],
                niveles: ["NL2", "NL5", "NL10", "NL25", "NL50", "NL100", "NL200", "NL400", "NL600", "NL1000"] // NivelMesa (Aplica igual que en Holdem)
            },
            'MTT': {
                subtipos: ['PLO vanilla (sin bounty)', 'PLO PKO'],
                niveles: [2, 5, 10, 25, 50, 100, 200, 400, 600, 1000] // NivelTorneo
            }
        }
    },

    // 2. Datos Independientes
    tiposDeRival: [
        'Desconocido', 
        'Fish',  
        'Reg Agresivo', 
        'Nit', 
        'Whale / Ballena'
    ],

    // 3. Clasificaciones
    clasificaciones: [
        { id: 1, name: 'ERRORES GRAVES' },
        { id: 2, name: 'MANOS TOP VALUE' },
        { id: 3, name: 'Pozos Grandes' },
        { id: 4, name: 'ERRORES PREFLOP' },
        { id: 5, name: 'Pozos 3beteados' },
        { id: 6, name: 'vs LOCO' },
        { id: 7, name: 'CALL-FOLD vs agresion' },
        { id: 8, name: 'DudaSize' },
        { id: 9, name: 'Inducimos' }
    ]
};