package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Direccion;

import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    // Contar cuántas direcciones se tienen registradas por usuario


    long countByUsuario_IdUsuario(Long idUsuario);

    // Listar - Obtener direcciones de un mismo Usuario
    List<Direccion> findByUsuarioId(Long idUsuario);

    // Verificar si ya existe una dirección registrada exacta
    boolean existsByDireccion(
            String calle, String numExterior, String numInterior, String codigoPostal
    );

    // Eliminar una dirección específica perteneciente a un usuario
    void deleteByIdDireccion(Long idDireccion, Long idUsuario);

    // Eliminar todas las direcciones registradas de un usuario
    void deleteByIdUsuario(Long idUsuario);

}