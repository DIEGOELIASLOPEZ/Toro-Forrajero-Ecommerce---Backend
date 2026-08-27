package org.toro_forrajero.service;

import org.toro_forrajero.dto.DetallePedidoDTO;
import java.util.List;

public interface IDetallePedidoService {
    List<DetallePedidoDTO> obtenerTodos();
    DetallePedidoDTO obtenerPorId(Long id);
    DetallePedidoDTO guardar(DetallePedidoDTO detallePedidoDTO);
    DetallePedidoDTO actualizar(Long id, DetallePedidoDTO detallePedidoDTO);
    void eliminar(Long id);
}