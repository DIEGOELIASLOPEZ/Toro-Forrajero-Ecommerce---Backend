-- ========================================================
-- 		Inserts para la Tabla Usuarios (10 clientes)
-- ========================================================
INSERT INTO usuario (nombre, apellido, telefono, area_interes, correo, estado, contrasena) VALUES 
('Mateo', 'Hernández', '5512345678', 'Bovino', 'mateo.hernandez@gmail.com', 'Veracruz', 'H3rn4nd3z!2026'),
('Sofía', 'García', '5698765432', 'Porcino', 'sofia.garcia@hotmail.com', 'Jalisco', 'S0f14G4rc14#'),
('Santiago', 'López', '5545678901', 'Bovino', 'santiago.lopez@outlook.com', 'Chihuahua', 'S4nt14g0L!99'),
('Valeria', 'Martínez', '5632109876', 'Aves', 'valeria.martinez@gmail.com', 'Sonora', 'V4l3r14M321*'),
('Diego', 'González', '5587654321', 'Porcino', 'diego.gonzalez@hotmail.com', 'San Luis Potosí', 'D13g0Gz!887'),
('Camila', 'Rodríguez', '5654321098', 'Ovino', 'camila.rodriguez@gmail.com', 'Michoacán', 'C4m1l4R0dr1g#'),
('Leonardo', 'Pérez', '5523456789', 'Bovino', 'leonardo.perez@outlook.com', 'Chiapas', 'L30P3r3z!2026'),
('Mariana', 'Sánchez', '5678901234', 'Aves', 'mariana.sanchez@gmail.com', 'Tamaulipas', 'M4r14n4S#55'),
('Gael', 'Ramírez', '5567890123', 'Ovino', 'gael.ramirez@hotmail.com', 'Durango', 'G43lR4m1r3z*9'),
('Ximena', 'Torres', '5689012345', 'Bovino', 'ximena.torres@outlook.com', 'Coahuila', 'X1m3n4T0rr3s!');
-- =================================================================================================
-- 		Inserts para la Tabla Usuarios (2 Admin) | Apartir del id_11 para que no tenga pedidos
-- =================================================================================================
INSERT INTO usuario (nombre, apellido, telefono, area_interes, correo, estado, contrasena, rol) VALUES 
('Admin', 'General', '5599887766', 'Bovino', 'soporte_toro_forrajero@outlook.com', 'CDMX', 'Admin1234*', 'admin'),
('Soporte', 'Sistema', '5500000000', 'Bovino', 'soporte_toro_forrajero@proton.me', 'CDMX', 'AdminPass123!', 'admin');
