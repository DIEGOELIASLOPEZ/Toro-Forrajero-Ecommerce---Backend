package org.toro_forrajero.repository;

import org.toro_forrajero.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findByUsuario_IdUsuario(Long idUsuario);
}