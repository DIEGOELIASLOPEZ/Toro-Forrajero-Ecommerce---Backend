package org.toro_forrajero.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.toro_forrajero.dto.PedidoDTO;
import org.toro_forrajero.model.*;
import org.toro_forrajero.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Scanner;

@Service
public class PedidoService implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MetodoPagoRepository metodoPagoRepository;
    private final CarritoRepository carritoRepository;
    private final DetalleCarritoRepository detalleCarritoRepository;
    private final DetallePedidoRepository detallePedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         UsuarioRepository usuarioRepository,
                         MetodoPagoRepository metodoPagoRepository,CarritoRepository carritoRepository, DetalleCarritoRepository detalleCarritoRepository, DetallePedidoRepository detallePedidoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.metodoPagoRepository = metodoPagoRepository;
        this.carritoRepository = carritoRepository;
        this.detalleCarritoRepository = detalleCarritoRepository;
        this.detallePedidoRepository = detallePedidoRepository;
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

    @Override
    @Transactional
    public PedidoDTO.PedidoResponse procesarCheckout(Long usuarioId, Long idMetodoPago) {
        //  Buscar el carrito del usuario
        List<Carrito> carritos = carritoRepository.findAll();
        Carrito carritoUsuario = carritos.stream()
                .filter(c -> c.getUsuario() != null && c.getUsuario().getIdUsuario().equals(usuarioId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró un carrito activo para el usuario: " + usuarioId));

        Long idCarrito = carritoUsuario.getIdCarrito();

        // Obtiene los detalles del producto del carrito segun el IdCarrito
        List<DetalleCarrito> itemsCarrito = detalleCarritoRepository.findByCarrito_IdCarrito(idCarrito);
        if (itemsCarrito.isEmpty()) {
            throw new RuntimeException("El carrito está vacío, no se puede procesar el pedido.");
        }

        // Calcula el monto total sumando los subtotales de los productos
        BigDecimal montoTotal = BigDecimal.ZERO;
        for (DetalleCarrito item : itemsCarrito) {
            BigDecimal precio = item.getProducto().getPrecioVenta() != null
                    ? item.getProducto().getPrecioVenta()
                    : BigDecimal.ZERO;
            BigDecimal subtotalItem = precio.multiply(BigDecimal.valueOf(item.getCantidad()));
            montoTotal = montoTotal.add(subtotalItem);
        }

        // Crea la entidad Pedido y asigna los datos requeridos
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setUsuario(carritoUsuario.getUsuario());
        nuevoPedido.setMontoTotal(montoTotal);
        nuevoPedido.setStatus("PENDIENTE");
        nuevoPedido.setFechaPedido(LocalDateTime.now());
        MetodoPago metodoPago = metodoPagoRepository.findById(idMetodoPago)
                .orElseThrow(() -> new RuntimeException("Método de pago con ID " + idMetodoPago + " no encontrado"));
        nuevoPedido.setMetodoPago(metodoPago);

        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        // Pasar los productos de DetalleCarrito a DetallePedido
        for (DetalleCarrito itemCarrito : itemsCarrito) {
            DetallePedido detallePedido = new DetallePedido();
            detallePedido.setPedido(pedidoGuardado);
            detallePedido.setProductos(itemCarrito.getProducto());
            detallePedido.setCantidad(itemCarrito.getCantidad());

            BigDecimal precio = itemCarrito.getProducto().getPrecioVenta() != null
                    ? itemCarrito.getProducto().getPrecioVenta()
                    : BigDecimal.ZERO;

            detallePedido.setPrecioUnitario(precio.doubleValue());
            detallePedido.setSubtotal(precio.multiply(BigDecimal.valueOf(itemCarrito.getCantidad())).doubleValue());

            detallePedidoRepository.save(detallePedido);
        }

        //  Vaciar el carrito una vez migrado al pedido
        detalleCarritoRepository.deleteByCarrito_IdCarrito(idCarrito);

        // Mapear la entidad guardada al DTO de respuesta (`PedidoResponse`)
        PedidoDTO.PedidoResponse response = new PedidoDTO.PedidoResponse();
        response.setIdPedido(pedidoGuardado.getIdPedido());
        response.setFechaPedido(pedidoGuardado.getFechaPedido());
        response.setMontoTotal(pedidoGuardado.getMontoTotal());
        response.setStatus(pedidoGuardado.getStatus());
        response.setIdUsuario(usuarioId);
        response.setIdMetodoPago(idMetodoPago);

        return response;
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