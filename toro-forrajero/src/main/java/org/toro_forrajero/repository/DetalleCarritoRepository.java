package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.toro_forrajero.model.DetalleCarrito;
import org.toro_forrajero.model.DetalleCarritoId;
import java.util.List;

public interface DetalleCarritoRepository extends JpaRepository<DetalleCarrito, DetalleCarritoId> {

    List<DetalleCarrito> findByCarrito_IdCarrito(Long idCarrito);

    @Transactional
    @Modifying
    void deleteByCarrito_IdCarrito(Long idCarrito);
}