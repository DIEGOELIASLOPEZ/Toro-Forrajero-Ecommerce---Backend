package org.toro_forrajero.service;


import org.springframework.stereotype.Service;
import org.toro_forrajero.dto.PedidoDTO;
import org.toro_forrajero.model.Pedido;
import org.toro_forrajero.repository.PedidoRepository;

import java.util.Date;
import java.util.List;

@Service
public class PedidoService implements IPedidoService{

    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository){
        this.pedidoRepository = pedidoRepository;
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidos() {
        return pedidoRepository.findAll().stream().map(this::entidadAResponse).toList();
    }

    @Override
    public PedidoDTO.PedidoResponse mostrarPedidoPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("ID " + id + " no encontrado"));

        return entidadAResponse(pedido);

    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidosDeUsuario(Long idUsuario) {
        return pedidoRepository.findByIdUsuario(idUsuario).stream().map(this::entidadAResponse).toList();
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidoUsuarioPorStatus(Long idUsuario, String status) {
        return pedidoRepository.findByIdUsuarioAndStatus(idUsuario, status).stream().map(this::entidadAResponse).toList();
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidosEntreFechas(Date fechaInicio, Date fechaFin) {
        return pedidoRepository.findByFechaPedidoBetween(fechaInicio, fechaFin).stream().map(this::entidadAResponse).toList();
    }

    @Override
    public PedidoDTO.PedidoResponse crearPedido(PedidoDTO.PedidoRequestCliente pedidoRequestCliente) {
        return null;
    }

    @Override
    public PedidoDTO.PedidoResponse modificarPedido(Long id, PedidoDTO.PedidoRequestAdmin pedidoRequestAdmin) {
        return null;
    }

    @Override
    public PedidoDTO.PedidoResponse modificarStatusPedido(Long id, String status) {
        return null;
    }

    @Override
    public void cancelarPedido(Long id) {

    }


    // Metodo Auxiliar para pasar de una Entidad a un objeto de tipo Response
    public PedidoDTO.PedidoResponse entidadAResponse(Pedido pedido){
        PedidoDTO.PedidoResponse pedidoResponse = new PedidoDTO.PedidoResponse();
        pedidoResponse.setIdPedido(pedido.getIdPedido());
        pedidoResponse.setFechaPedido(pedido.getFechaPedido());
        pedidoResponse.setMontoTotal(pedido.getMontoTotal());
        pedidoResponse.setStatus(pedidoResponse.getStatus());
        pedidoResponse.setIdUsuario(pedidoResponse.getIdUsuario());
        pedidoResponse.setMetodoPago(pedidoResponse.getMetodoPago());
        pedidoResponse.setIdDireccion(pedidoResponse.getIdDireccion());

        return pedidoResponse;
    }
}
