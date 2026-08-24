package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Direccion;

import java.util.List;

public interface DireccionRepository extends JpaRepository<Direccion, Long> {

    // Contar cuántas direcciones se tienen registradas por usuario
    long countByUsuario_IdUsuario(Long idUsuario);

    // Listar - Obtener direcciones de un mismo Usuario
    List<Direccion> findByUsuario_IdUsuario(Long idUsuario);

    // Verificar si ya existe una dirección registrada
    boolean existsByCalleAndNumExteriorAndNumInteriorAndCodigoPostal(
            String calle, int numExterior, int numInterior, int codigoPostal
    );

    // Eliminar una dirección específica de un usuario
    void deleteByIdDireccionAndUsuario_IdUsuario(Long idDireccion, Long idUsuario);

    // Eliminar todas las direcciones registradas de un usuario
    void deleteByUsuario_IdUsuario(Long idUsuario);
}