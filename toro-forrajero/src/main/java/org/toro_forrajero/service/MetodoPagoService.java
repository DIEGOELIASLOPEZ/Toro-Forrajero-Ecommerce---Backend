package org.toro_forrajero.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.toro_forrajero.model.MetodoPago;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.MetodoPagoRepository;
import org.toro_forrajero.repository.UsuarioRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetodoPagoService implements IMetodoPagoService {

    private final MetodoPagoRepository metodoPagoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public MetodoPago agregarMetodoPago(MetodoPago metodoPago, Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        metodoPago.setUsuario(usuario);
        return metodoPagoRepository.save(metodoPago);
    }

    @Override
    public List<MetodoPago> obtenerMetodosPorUsuario(Long idUsuario) {
        return metodoPagoRepository.findByUsuario_IdUsuario(idUsuario);
    }

    @Override
    public void eliminarMetodoPago(Long idMetodoPago) {
        if(!metodoPagoRepository.existsById(idMetodoPago)){
            throw new RuntimeException("No se puede eliminar: El método de pago con ID " + idMetodoPago + " no existe.");
        }
        metodoPagoRepository.deleteById(idMetodoPago);
    }

    @Override
    public void eliminarTodosLosMetodosDeUsuario(Long idUsuario) {
        metodoPagoRepository.deleteByUsuario_IdUsuario(idUsuario);
    }
}