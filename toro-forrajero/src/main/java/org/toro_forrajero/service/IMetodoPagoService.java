package org.toro_forrajero.service;

import org.toro_forrajero.dto.MetodoPagoResponseDTO;
import org.toro_forrajero.model.MetodoPago;

import java.util.List;

public interface IMetodoPagoService {
    MetodoPagoResponseDTO agregarMetodoPago(MetodoPago metodoPago, Long idUsuario);

    List<MetodoPagoResponseDTO> obtenerMetodosPorUsuario(Long idUsuario);

    MetodoPagoResponseDTO actualizarMetodoPago(Long idMetodoPago, MetodoPago metodoPagoActualizado);

    void eliminarMetodoPago(Long idMetodoPago);

    void eliminarTodosLosMetodosDeUsuario(Long idUsuario);
}