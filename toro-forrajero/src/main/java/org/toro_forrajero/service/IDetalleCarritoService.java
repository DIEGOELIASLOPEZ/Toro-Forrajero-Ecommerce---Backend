package org.toro_forrajero.service;

import org.toro_forrajero.dto.DetalleCarritoResponseDTO;
import java.util.List;

public interface IDetalleCarritoService {

    DetalleCarritoResponseDTO agregarProducto(Long idCarrito, Long idProducto, Integer cantidad);

    List<DetalleCarritoResponseDTO> obtenerDetallesDeCarrito(Long idCarrito);

    // NUEVO MÉTODO para agregar y quitar
    DetalleCarritoResponseDTO actualizarCantidad(Long idCarrito, Long idProducto, Integer cantidadNueva);

    void eliminarProductoDeCarrito(Long idCarrito, Long idProducto);

    void vaciarCarrito(Long idCarrito);
}
