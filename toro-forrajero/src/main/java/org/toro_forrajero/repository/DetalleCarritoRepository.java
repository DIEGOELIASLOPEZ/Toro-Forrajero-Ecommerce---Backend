//package org.toro_forrajero.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.toro_forrajero.model.DetalleCarrito;
//import org.toro_forrajero.model.DetalleCarritoId;
//import java.util.List;
//
//public interface DetalleCarritoRepository extends JpaRepository<DetalleCarrito, DetalleCarritoId> {
//
//    // Buscar todos los items que pertenecen a un carrito específico
//    List<DetalleCarrito> findByCarritoIdCarrito(Long idCarrito);
//
//    // Eliminar los productos de un carrito al vaciarlo
//    void deleteByCarritoIdCarrito(Long idCarrito);
//}