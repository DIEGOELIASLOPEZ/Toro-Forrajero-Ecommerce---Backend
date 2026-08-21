package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Pedido;
import org.toro_forrajero.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Opción A: Buscar navegando por el ID del usuario (usuario.idUsuario)
    List<Pedido> findByUsuario_IdUsuario(Long idUsuario);

    // Opción B: Buscar pasando directamente el objeto Usuario
    List<Pedido> findByUsuario(Usuario usuario);

    // Buscar por ID de usuario y Status
    List<Pedido> findByUsuario_IdUsuarioAndStatus(Long idUsuario, String status);

    // Buscar pedidos realizados en un rango de fechas (Permanece igual)
    List<Pedido> findByFechaPedidoBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}