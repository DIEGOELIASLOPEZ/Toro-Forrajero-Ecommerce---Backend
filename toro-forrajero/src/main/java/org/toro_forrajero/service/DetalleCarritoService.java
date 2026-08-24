package org.toro_forrajero.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.toro_forrajero.dto.DetalleCarritoResponseDTO;
import org.toro_forrajero.model.Carrito;
import org.toro_forrajero.model.DetalleCarrito;
import org.toro_forrajero.model.DetalleCarritoId;
import org.toro_forrajero.model.Productos;
import org.toro_forrajero.repository.CarritoRepository;
import org.toro_forrajero.repository.DetalleCarritoRepository;
import org.toro_forrajero.repository.ProductosRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DetalleCarritoService implements IDetalleCarritoService {

    private final DetalleCarritoRepository detalleCarritoRepository;
    private final CarritoRepository carritoRepository;
    private final ProductosRepository productosRepository;

    private DetalleCarritoResponseDTO convertirADto(DetalleCarrito detalle) {
        Productos prod = detalle.getProducto();

        // Usamos getPrecioVenta() en lugar de getPrecio()
        BigDecimal precio = prod.getPrecioVenta() != null ? prod.getPrecioVenta() : BigDecimal.ZERO;
        BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(detalle.getCantidad()));

        return DetalleCarritoResponseDTO.builder()
                .idCarrito(detalle.getCarrito().getIdCarrito())
                .idProducto(prod.getIdProducto()) // getIDProducto()
                .nombreProducto(prod.getNombre())   // getNombre()
                .precioUnitario(precio)
                .cantidad(detalle.getCantidad())
                .subtotal(subtotal)
                .build();
    }

    @Override
    @Transactional
    public DetalleCarritoResponseDTO agregarProducto(Long idCarrito, Long idProducto, Integer cantidad) {
        Carrito carrito = carritoRepository.findById(idCarrito)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        Productos producto = productosRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        DetalleCarritoId idCompuesto = new DetalleCarritoId(idCarrito, idProducto);

        DetalleCarrito detalle = detalleCarritoRepository.findById(idCompuesto)
                .orElse(new DetalleCarrito());

        if (detalle.getId().getIdCarrito() == null) {
            detalle.setId(idCompuesto);
            detalle.setCarrito(carrito);
            detalle.setProducto(producto);
            detalle.setCantidad(cantidad);
        } else {
            detalle.setCantidad(detalle.getCantidad() + cantidad);
        }

        DetalleCarrito guardado = detalleCarritoRepository.save(detalle);
        return convertirADto(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleCarritoResponseDTO> obtenerDetallesDeCarrito(Long idCarrito) {
        if (!carritoRepository.existsById(idCarrito)) {
            throw new RuntimeException("No se puede obtener detalles del carrito: " + idCarrito + " no existe.");
        }

        List<DetalleCarrito> detalles = detalleCarritoRepository.findByCarrito_IdCarrito(idCarrito);

        //Se convierte la lista de entidades a una lista de DTOs usando Streams
        return detalles.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminarProductoDeCarrito(Long idCarrito, Long idProducto) {
        DetalleCarritoId id = new DetalleCarritoId(idCarrito, idProducto);
        detalleCarritoRepository.deleteById(id);
    }

    @Override
    public void vaciarCarrito(Long idCarrito) {
        detalleCarritoRepository.deleteByCarrito_IdCarrito(idCarrito);
    }
}