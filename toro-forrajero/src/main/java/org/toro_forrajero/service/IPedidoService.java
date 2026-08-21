package org.toro_forrajero.service;

import org.toro_forrajero.dto.PedidoDTO;

import java.util.Date;
import java.util.List;

public interface IPedidoService {

    List<PedidoDTO.PedidoResponse> mostrarPedidos();

    PedidoDTO.PedidoResponse mostrarPedidoPorId(Long id);

    List<PedidoDTO.PedidoResponse> mostrarPedidosDeUsuario(Long idUsuario);

    List<PedidoDTO.PedidoResponse> mostrarPedidoUsuarioPorStatus(Long idUsuario, String status);

    List<PedidoDTO.PedidoResponse> mostrarPedidosEntreFechas(Date fechaInicio, Date fechaFin);

    PedidoDTO.PedidoResponse crearPedido(PedidoDTO.PedidoRequestCliente pedidoRequestCliente);

    PedidoDTO.PedidoResponse modificarPedido(Long id, PedidoDTO.PedidoRequestAdmin pedidoRequestAdmin);

    PedidoDTO.PedidoResponse modificarStatusPedido(Long id, String status);

    void cancelarPedido(Long id);


}
