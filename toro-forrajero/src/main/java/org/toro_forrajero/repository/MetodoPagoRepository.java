package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.MetodoPago;

import java.util.List;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {

    // Contar cuántas tarjetas existen por usuario
    long countByUsuario_IdUsuario(Long idUsuario);

    // Traer todas las tarjetas de un usuario
    List<MetodoPago> findByUsuario_IdUsuario(Long idUsuario);

    // Verificar si ya existe un número de tarjeta registrado
    boolean existsByNumTarjeta(String numTarjeta);

    // Eliminar todas las tarjetas asociadas a un usuario
    void deleteByUsuario_IdUsuario(Long idUsuario);

}