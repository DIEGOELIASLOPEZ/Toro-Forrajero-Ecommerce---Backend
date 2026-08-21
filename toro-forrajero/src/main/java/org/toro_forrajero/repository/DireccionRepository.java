package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Direccion;

import java.util.List;
import java.util.Optional;

public interface DireccionRepository extends JpaRepository<Direccion, Long>{
    //Contar cuantas direcciones se tienen registradas por usuario
    long countByUsuarioId(Long idUsuario);

    //Listar - Obtener direcciones de un mismo Usuario
    List<Direccion> findByUsuarioId(Long idUsuario);

    //Verificar si ya existe una direccion registrada
    boolean existsByDireccion(String calle, int numExterior, int numInterior, int codigoPostal);

    //Eliminar una direccion
    void deleteByDireccion(Long idUsuario, Long idDireccion);

    //Eliminar todas las direcciones registradas de un usuario
    void deleteByUsuarioId(Long idUsuario);

}
