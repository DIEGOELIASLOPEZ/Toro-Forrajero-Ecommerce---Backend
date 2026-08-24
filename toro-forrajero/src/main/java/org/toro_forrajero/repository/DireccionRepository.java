package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Direccion;

import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    // Listar - Obtener direcciones de un mismo Usuario
    List<Direccion> findByUsuario_IdUsuario(Long idUsuario);

    // Contar cuántas direcciones tiene un usuario específico
    long countByUsuario_IdUsuario(Long idUsuario);

    // Verificar si ya existe una dirección registrada exacta
    boolean existsByCalleAndNumExteriorAndNumInteriorAndCodigoPostal(
            String calle, String numExterior, String numInterior, String codigoPostal
    );

    // Eliminar una dirección específica perteneciente a un usuario
    void deleteByIdDireccionAndUsuario_IdUsuario(Long idDireccion, Long idUsuario);

    // Eliminar todas las direcciones registradas de un usuario
    void deleteByUsuario_IdUsuario(Long idUsuario);

}