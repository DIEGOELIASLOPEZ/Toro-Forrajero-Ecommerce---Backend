package org.toro_forrajero.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.toro_forrajero.dto.DetallePedidoDTO;
import org.toro_forrajero.model.DetallePedido;
import org.toro_forrajero.model.Pedido;
import org.toro_forrajero.model.Productos;
import org.toro_forrajero.repository.DetallePedidoRepository;
import org.toro_forrajero.repository.PedidoRepository;
import org.toro_forrajero.repository.ProductosRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DetallePedidoService implements IDetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductosRepository productosRepository;

    @Override
    public List<DetallePedidoDTO> obtenerTodos() {
        return detallePedidoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public DetallePedidoDTO obtenerPorId(Long id) {
        DetallePedido detalle = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetallePedido no encontrado con ID: " + id));
        return convertirADTO(detalle);
    }

    @Override
    public DetallePedidoDTO guardar(DetallePedidoDTO dto) {
        DetallePedido detalle = convertirAEntidad(dto);
        DetallePedido guardado = detallePedidoRepository.save(detalle);
        return convertirADTO(guardado);
    }

    @Override
    public DetallePedidoDTO actualizar(Long id, DetallePedidoDTO dto) {
        DetallePedido detalleExistente = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetallePedido no encontrado con ID: " + id));

        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + dto.getPedidoId()));

        Productos producto = productosRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + dto.getProductoId()));

        detalleExistente.setCantidad(dto.getCantidad());
        detalleExistente.setPrecioUnitario(dto.getPrecioUnitario());
        detalleExistente.setSubtotal(dto.getSubtotal());
        detalleExistente.setPedido(pedido);
        detalleExistente.setProductos(producto);

        DetallePedido actualizado = detallePedidoRepository.save(detalleExistente);
        return convertirADTO(actualizado);
    }

    @Override
    public void eliminar(Long id) {
        if (!detallePedidoRepository.existsById(id)) {
            throw new RuntimeException("DetallePedido no encontrado con ID: " + id);
        }
        detallePedidoRepository.deleteById(id);
    }

    // --- Métodos de Mapeo (DTO <-> Entity) ---

    private DetallePedidoDTO convertirADTO(DetallePedido entidad) {
        return new DetallePedidoDTO(
                entidad.getId(),
                entidad.getCantidad(),
                entidad.getPrecioUnitario(),
                entidad.getSubtotal(),
                entidad.getProductos() != null ? entidad.getProductos().getIdProducto() : null,
                entidad.getPedido() != null ? entidad.getPedido().getIdPedido() : null
        );
    }

    private DetallePedido convertirAEntidad(DetallePedidoDTO dto) {
        Pedido pedido = pedidoRepository.findById(dto.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + dto.getPedidoId()));

        Productos producto = productosRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + dto.getProductoId()));

        DetallePedido detalle = new DetallePedido();
        detalle.setId(dto.getId());
        detalle.setCantidad(dto.getCantidad());
        detalle.setPrecioUnitario(dto.getPrecioUnitario());
        detalle.setSubtotal(dto.getSubtotal());
        detalle.setPedido(pedido);
        detalle.setProductos(producto);

        return detalle;
    }
}