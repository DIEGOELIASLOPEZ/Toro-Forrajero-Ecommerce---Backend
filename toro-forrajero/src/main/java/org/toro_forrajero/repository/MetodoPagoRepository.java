package org.toro_forrajero.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.MetodoPago;

import java.util.List;
import java.util.Optional;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago,Long> {
    //Contar cuatnas tarjetas existen por usuario
    long countByUsuarioId(Long idUsuario);

    //Traer todas las tarjetas de un usuario
    List<MetodoPago> findByUsuarioId(Long idUsuario);

    //Verificar si ya existe un número de tarjeta registrado
    boolean existsByNumTarjeta(String numTarjeta);

    //Eliminar todas las tarjetas asociadas a un usuario
    void deleteByUsuarioId(Long idUsuario);

}
