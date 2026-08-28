-- ================================================
-- 		Inserts para la Tabla direccion
-- ================================================

# Observación: id_usuario verificado contra la tabla usuario ya creada (10 clientes, IDs 1-10).

INSERT INTO direccion (
    calle,
    num_exterior,
    num_interior,
    codigo_postal,
    alcaldia,
    estado,
    tel,
    email,
    id_usuario
)
VALUES
('Av. Reforma', '450', NULL, '06600', 'Ciudad de México', 'Ciudad de México', '5511223344', 'ana@gmail.com', 1),
('Calle Hidalgo', '88', 'A', '42000', 'Pachuca', 'Hidalgo', '7712345566', 'jperez11@hotmail.com', 2),
('Av. Toluca', '210', NULL, '50100', 'Toluca', 'Estado de México', '7221009988', 'mlopez@gmail.com', 3),
('Manzana 12', 'Lote 5', NULL, '31000', 'Chihuahua', 'Chihuahua', '6141122334', 'granja.lasvacas@gmail.com', 4),
('Av. Constitución', '1500', '2', '64000', 'Monterrey', 'Nuevo León', '8113344556', 'rgarcia@outlook.com', 5),
('Calle Morelos', '76', NULL, '44100', 'Guadalajara', 'Jalisco', '3312349876', 'jalisco.agro@gmail.com', 6),
('Blvd. Solidaridad', '340', NULL, '83100', 'Hermosillo', 'Sonora', '6621122334', 'lsonora@gmail.com', 7),
('Calle Yucatán', '55', 'B', '97000', 'Mérida', 'Yucatán', '9991234567', 'cerdosyuc@hotmail.com', 8),
('Av. Juárez', '620', NULL, '72000', 'Puebla', 'Puebla', '2221345678', 'avipuebla@gmail.com', 9),
('Camino Real', '15', NULL, '36000', 'Guanajuato', 'Guanajuato', '4731122334', 'losporcinos22@yahoo.com', 10);