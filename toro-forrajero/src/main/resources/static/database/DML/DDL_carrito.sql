-- ========================================================
--      Inserts para la Tabla Carrito (1 por Cliente)
-- ========================================================
-- Se asigna un carrito activo a cada cliente (id_usuario 1 al 10)
INSERT INTO carrito (id_usuario) VALUES 
(1),  -- Carrito 1: Mateo Hernández (Bovino)
(2),  -- Carrito 2: Sofía García (Porcino)
(3),  -- Carrito 3: Santiago López (Bovino)
(4),  -- Carrito 4: Valeria Martínez (Aves)
(5),  -- Carrito 5: Diego González (Porcino)
(6),  -- Carrito 6: Camila Rodríguez (Ovino)
(7),  -- Carrito 7: Leonardo Pérez (Bovino)
(8),  -- Carrito 8: Mariana Sánchez (Aves)
(9),  -- Carrito 9: Gael Ramírez (Ovino)
(10); -- Carrito 10: Ximena Torres (Bovino)


-- ========================================================
--      Inserts para la Tabla Detalle_Carrito
-- ========================================================
-- Se agregan productos afines al área de interés de cada usuario
INSERT INTO detalle_carrito (id_carrito, id_producto, cantidad) VALUES 
-- Carrito 1 (Mateo - Bovinos)
(1, 1, 2),  -- Mezcla Nutridor 25kg (El nogal)
(1, 9, 1),  -- Engorda Ganado 25kg (El Nogal)

-- Carrito 2 (Sofía - Porcinos)
(2, 5, 3),  -- Finalizador® Engorda Cerdos H.L. 25kg (ADM)
(2, 13, 2), -- Engorda 25kg (El Nogal)

-- Carrito 3 (Santiago - Bovinos)
(3, 2, 4),  -- Mezcla Ganadera 25kg (ADM)
(3, 17, 1), -- Ara H Engorda Ganado 12% Rol 25kg (Alimentos Arandas)

-- Carrito 4 (Valeria - Aves)
(4, 3, 2),  -- Pollo Especial 25kg (ADM)
(4, 11, 3), -- Fortipollo (iniciador) 25kg (El Nogal)

-- Carrito 5 (Diego - Porcinos)
(5, 6, 2),  -- Growpig!® Desarrollo 25kg (ADM)
(5, 21, 1), -- Ara H Crecicerdos 25kg (Alimentos Arandas)

-- Carrito 6 (Camila - Ovinos)
(6, 7, 3),  -- Borregos Forte 25kg (ADM)
(6, 15, 2), -- Preiniciador Borrego 25kg (El Nogal)

-- Carrito 7 (Leonardo - Bovinos)
(7, 10, 2), -- Concentrado para Engorda Ganado 25kg (El Nogal)
(7, 18, 1), -- Ara P Crecimiento Becerra 25kg (Alimentos Arandas)

-- Carrito 8 (Mariana - Aves)
(8, 4, 4),  -- Nutridor Pollos 25kg (ADM)
(8, 19, 2), -- Ara M Inipollo 25kg (Alimentos Arandas)

-- Carrito 9 (Gael - Ovinos)
(9, 8, 2),  -- Borrego Ganador 25kg (ADM)
(9, 24, 1), -- Ara H Borrego Engorda Rol Plus 25kg (Alimentos Arandas)

-- Carrito 10 (Ximena - Bovinos)
(10, 1, 3), -- Mezcla Nutridor 25kg (El nogal)
(10, 17, 2);-- Ara H Engorda Ganado 12% Rol 25kg (Alimentos Arandas)