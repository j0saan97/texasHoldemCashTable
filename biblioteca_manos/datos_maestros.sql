

-- INSERTAR VARIEDADES
INSERT INTO variedades (id, nombre) VALUES 
(1, 'MTT'), 
(2, 'CASH_GAME'), 
(3, 'SPIN_AND_GO');

-- INSERTAR SUBTIPOS PARA MTT (ID 1)
INSERT INTO subtipos (variedad_id, nombre) VALUES 
(1, 'vanilla (sin bounty)'), 
(1, 'PKO'), 
(1, 'MisteryBounty'), 
(1, 'Hyper_PKO'), 
(1, 'Hyper_vanilla'),
(1, 'PLO vanilla'),
(1, 'PLO PKO');

-- INSERTAR SUBTIPOS PARA CASH_GAME (ID 2)
INSERT INTO subtipos (variedad_id, nombre) VALUES 
(2, '6Max - SIN ANTE'), 
(2, '6Max - CON ANTE'), 
(2, '9max - SIN ANTE'), 
(2, '9max - CON ANTE'), 
(2, '9max - 200bb'), 
(2, 'ZOOM'),
(2, 'PLO 6Max'),
(2, 'PLO 9Max'),
(2, 'PLO ZOOM');

-- INSERTAR SUBTIPOS PARA SPIN_AND_GO (ID 3)
INSERT INTO subtipos (variedad_id, nombre) VALUES 
(3, 'velocidad normal'), 
(3, 'NITRO'),
(3, 'PLO Spin');

-- INSERTAR CATEGORÍAS (Tus clasificaciones)
INSERT INTO categorias (id, nombre) VALUES 
(1, 'ERRORES GRAVES'),
(2, 'MANOS TOP VALUE'),
(3, 'Pozos Grandes'),
(4, 'ERRORES PREFLOP'),
(5, 'Pozos 3beteados'),
(6, 'vs LOCO'),
(7, 'CALL-FOLD vs agresion'),
(8, 'DudaSize'),
(9, 'Inducimos');