package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Pedido;

import java.util.Date;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    //Mostrar los pedidios de un usuario
    List<Pedido> findByIdUsuario(Long id_usuario);

    //Mostrar el tipo de  Status de los pedidos de un Usuario
    List<Pedido> findByIdUsuarioAndStatus(Long id_usuario, String status);

    // Mostrar Pedidos realizadas en ciertas fechas
    List<Pedido> findByFechaPedidoBetween(Date fechaInicio, Date fechaFin);



}
