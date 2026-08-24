package org.toro_forrajero.service;

import org.toro_forrajero.dto.DetalleCarritoResponseDTO;
import java.util.List;

public interface IDetalleCarritoService {
    DetalleCarritoResponseDTO agregarProducto(Long idCarrito, Long idProducto, Integer cantidad);
    List<DetalleCarritoResponseDTO> obtenerDetallesDeCarrito(Long idCarrito);
    void eliminarProductoDeCarrito(Long idCarrito, Long idProducto);
    void vaciarCarrito(Long idCarrito);
}