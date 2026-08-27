package org.toro_forrajero.service;

import org.toro_forrajero.dto.PedidoDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface IPedidoService {

    List<PedidoDTO.PedidoResponse> mostrarPedidos();

    PedidoDTO.PedidoResponse mostrarPedidoPorId(Long id);

    List<PedidoDTO.PedidoResponse> mostrarPedidosDeUsuario(Long idUsuario);

    List<PedidoDTO.PedidoResponse> mostrarPedidoUsuarioPorStatus(Long idUsuario, String status);

    List<PedidoDTO.PedidoResponse> mostrarPedidosEntreFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    PedidoDTO.PedidoResponse crearPedido(PedidoDTO.PedidoRequestCliente pedidoRequestCliente);

    PedidoDTO.PedidoResponse procesarCheckout(Long usuarioId, Long idMetodoPago);

    PedidoDTO.PedidoResponse modificarPedido(Long id, PedidoDTO.PedidoRequestAdmin pedidoRequestAdmin);

    PedidoDTO.PedidoResponse modificarStatusPedido(Long id, String status);

    PedidoDTO.PedidoResponse modificarFechaEntregaPedido(Long id, LocalDateTime fechaNueva);

    PedidoDTO.PedidoResponse cancelarPedido(Long id);
}