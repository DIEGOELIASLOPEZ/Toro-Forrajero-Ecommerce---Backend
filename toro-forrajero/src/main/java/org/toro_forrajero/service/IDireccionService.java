package org.toro_forrajero.service;

import org.toro_forrajero.model.Direccion;
import java.util.List;

// DECLARAMOS  nombre de METODOS Y QUE ARGUMENTOS TENDRA PARA DESPUES CREAR LA LOGICA

public interface IDireccionService {

    // Crear una nueva dirección
    Direccion crearDireccion(Direccion direccion);

    // Listar - Mostrar direcciones guardadas de un usuario
    List<Direccion> mostrarDireccion(Long idUsuario);

    // Contar las direcciones de un usuario
    long contarDireccion(Long idUsuario);

    // Verificar si una dirección ya existe (mismos datos)
    boolean verificarDireccion(String calle, String numExterior, String numInterior, String codigoPostal);

    // Eliminar una dirección puntual de un usuario
    void eliminarDireccion(Long idUsuario, Long idDireccion);

    // Eliminar todas las direcciones de un usuario
    void eliminarDireccionesDeUsuario(Long idUsuario);
}