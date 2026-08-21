package org.toro_forrajero.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.MetodoPago;

import java.util.List;
import java.util.Optional;

public interface MetodoPagoRepository extends JpaRepository<MetodoPago,Long> {
    //Contar cuantas tarjetas existen por usuario
    long countByUsuarioIdUsuario(Long idUsuario);

    //Traer todas las tarjetas de un usuario
    List<MetodoPago> findByUsuarioIdUsuario(Long idUsuario);

    //Verificar si ya existe un número de tarjeta registrado
    boolean existsByNumTarjeta(String numTarjeta);

    //Eliminar todas las tarjetas asociadas a un usuario
    void deleteByUsuarioIdUsuario(Long idUsuario);

}
