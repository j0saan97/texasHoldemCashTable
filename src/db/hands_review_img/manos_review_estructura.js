const POKER_CONFIG = {
    // 1. Estructura Jerárquica del Juego
    modalidades: {
        'NoLimitHoldem': {
            'MTT': [
                'vanilla (sin bounty)', 
                'PKO', 
                'MisteryBounty', 
                'Hyper_PKO', 
                'Hyper_vanilla'
            ],
            'CASH_GAME': [
                '6Max - SIN ANTE', 
                '6Max - CON ANTE', 
                '9max - SIN ANTE', 
                '9max - CON ANTE', 
                '9max - CON ANTE DOBLADO (200bb)', 
                '9max - CON ANTE (100bb)', 
                'ZOOM'
            ], // <-- FALTABA ESTA COMA
            'SPIN_AND_GO': [
                'velocidad_normal ',
                'NITRO'
            ]
        },
        'PotLimitOmaha': {
            'CASH_GAME': [
                'PLO 6Max', 
                'PLO 9Max', 
                'PLO ZOOM'
            ],
            'MTT': [
                'PLO vanilla (sin bounty)', 
                'PLO PKO'
            ]
        }
    },

    // 2. Datos Independientes
    tiposDeRival: [
        'Desconocido', // Movido al inicio para que sea el default por índice 0
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