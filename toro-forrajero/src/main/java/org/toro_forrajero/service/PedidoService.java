package org.toro_forrajero.service;

import org.springframework.stereotype.Service;
import org.toro_forrajero.dto.PedidoDTO;
import org.toro_forrajero.model.MetodoPago;
import org.toro_forrajero.model.Pedido;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.MetodoPagoRepository;
import org.toro_forrajero.repository.PedidoRepository;
import org.toro_forrajero.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MetodoPagoRepository metodoPagoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         UsuarioRepository usuarioRepository,
                         MetodoPagoRepository metodoPagoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.metodoPagoRepository = metodoPagoRepository;
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidos() {
        return pedidoRepository.findAll().stream()
                .map(this::entidadAResponse)
                .toList();
    }

    @Override
    public PedidoDTO.PedidoResponse mostrarPedidoPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido con ID " + id + " no encontrado"));

        return entidadAResponse(pedido);
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidosDeUsuario(Long idUsuario) {
        return pedidoRepository.findByUsuario_IdUsuario(idUsuario).stream()
                .map(this::entidadAResponse)
                .toList();
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidoUsuarioPorStatus(Long idUsuario, String status) {
        return pedidoRepository.findByUsuario_IdUsuarioAndStatus(idUsuario, status).stream()
                .map(this::entidadAResponse)
                .toList();
    }

    @Override
    public List<PedidoDTO.PedidoResponse> mostrarPedidosEntreFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return pedidoRepository.findByFechaPedidoBetween(fechaInicio, fechaFin).stream()
                .map(this::entidadAResponse)
                .toList();
    }

    @Override
    public PedidoDTO.PedidoResponse crearPedido(PedidoDTO.PedidoRequestCliente nuevoPedido) {
        LocalDateTime fechaActual = LocalDateTime.now();

        // Buscar entidades relacionadas por ID
        Usuario usuario = usuarioRepository.findById(nuevoPedido.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario con ID " + nuevoPedido.getIdUsuario() + " no encontrado"));

        MetodoPago metodoPago = metodoPagoRepository.findById(nuevoPedido.getIdMetodoPago())
                .orElseThrow(() -> new RuntimeException("Método de pago con ID " + nuevoPedido.getIdMetodoPago() + " no encontrado"));

        Pedido pedido = Pedido.builder()
                .fechaPedido(fechaActual)
                .fechaEntrega(fechaActual.plusDays(5)) // Fecha estimada de entrega
                .montoTotal(nuevoPedido.getMontoTotal())
                .status("En proceso")
                .usuario(usuario)
                .metodoPago(metodoPago)
                .build();

        Pedido pedidoCreado = pedidoRepository.save(pedido);
        return entidadAResponse(pedidoCreado);
    }

    @Override
    public PedidoDTO.PedidoResponse modificarPedido(Long id, PedidoDTO.PedidoRequestAdmin pedidoExistente) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el pedido con ID " + id));

        if (pedidoExistente.getMontoTotal() != null) {
            pedido.setMontoTotal(pedidoExistente.getMontoTotal());
        }

        if (pedidoExistente.getStatus() != null) {
            pedido.setStatus(pedidoExistente.getStatus());
        }

        if (pedidoExistente.getFechaEntrega() != null) {
            pedido.setFechaEntrega(pedidoExistente.getFechaEntrega());
        }

        if (pedidoExistente.getIdMetodoPago() != null) {
            MetodoPago metodoPago = metodoPagoRepository.findById(pedidoExistente.getIdMetodoPago())
                    .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
            pedido.setMetodoPago(metodoPago);
        }

        Pedido pedidoModificado = pedidoRepository.save(pedido);
        return entidadAResponse(pedidoModificado);
    }

    @Override
    public PedidoDTO.PedidoResponse modificarStatusPedido(Long id, String status) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el pedido con ID " + id));

        pedido.setStatus(status);

        if ("Entregado".equalsIgnoreCase(status)) {
            pedido.setFechaEntrega(LocalDateTime.now());
        }

        Pedido pedidoModificado = pedidoRepository.save(pedido);
        return entidadAResponse(pedidoModificado);
    }

    @Override
    public PedidoDTO.PedidoResponse modificarFechaEntregaPedido(Long id, LocalDateTime fechaNueva) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el pedido con ID " + id));

        pedido.setFechaEntrega(fechaNueva);

        Pedido pedidoModificado = pedidoRepository.save(pedido);
        return entidadAResponse(pedidoModificado);
    }

    @Override
    public PedidoDTO.PedidoResponse cancelarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el pedido con ID " + id));

        pedido.setStatus("Cancelado");

        Pedido pedidoModificado = pedidoRepository.save(pedido);
        return entidadAResponse(pedidoModificado);
    }

    // Método auxiliar para transformar una Entidad en DTO Response
    public PedidoDTO.PedidoResponse entidadAResponse(Pedido pedido) {
        PedidoDTO.PedidoResponse pedidoResponse = new PedidoDTO.PedidoResponse();
        pedidoResponse.setIdPedido(pedido.getIdPedido());
        pedidoResponse.setFechaPedido(pedido.getFechaPedido());
        pedidoResponse.setFechaEntrega(pedido.getFechaEntrega());
        pedidoResponse.setMontoTotal(pedido.getMontoTotal());
        pedidoResponse.setStatus(pedido.getStatus());

        if (pedido.getUsuario() != null) {
            pedidoResponse.setIdUsuario(pedido.getUsuario().getIdUsuario());
        }

        if (pedido.getMetodoPago() != null) {
            pedidoResponse.setIdMetodoPago(pedido.getMetodoPago().getIdMetodoPago());
        }

        return pedidoResponse;
    }
}