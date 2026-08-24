package org.toro_forrajero.service;

import org.toro_forrajero.model.MetodoPago;

import java.util.List;

public interface IMetodoPagoService {
    MetodoPago agregarMetodoPago(MetodoPago metodoPago, Long idUsuario);

    List<MetodoPago> obtenerMetodosPorUsuario(Long idUsuario);

    void eliminarMetodoPago(Long idMetodoPago);

    void eliminarTodosLosMetodosDeUsuario(Long idUsuario);
}
