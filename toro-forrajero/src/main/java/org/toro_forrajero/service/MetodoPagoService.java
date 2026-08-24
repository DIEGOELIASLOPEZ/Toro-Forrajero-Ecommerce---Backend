package org.toro_forrajero.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.toro_forrajero.dto.MetodoPagoResponseDTO;
import org.toro_forrajero.model.MetodoPago;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.MetodoPagoRepository;
import org.toro_forrajero.repository.UsuarioRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetodoPagoService implements IMetodoPagoService {

    private final MetodoPagoRepository metodoPagoRepository;
    private final UsuarioRepository usuarioRepository;

    // Mapear Entidad a DTO
    private MetodoPagoResponseDTO convertirADto(MetodoPago metodoPago) {
        return MetodoPagoResponseDTO.builder()
                .idMetodoPago(metodoPago.getIdMetodoPago())
                .numTarjeta(metodoPago.getNumTarjeta())
                .fechaExpiracion(metodoPago.getFechaExpiracion())
                .idUsuario(metodoPago.getUsuario() != null ? metodoPago.getUsuario().getIdUsuario() : null)
                .build();
    }

    @Override
    @Transactional
    public MetodoPagoResponseDTO agregarMetodoPago(MetodoPago metodoPago, Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        metodoPago.setUsuario(usuario);
        MetodoPago guardado = metodoPagoRepository.save(metodoPago);
        return convertirADto(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MetodoPagoResponseDTO> obtenerMetodosPorUsuario(Long idUsuario) {
        List<MetodoPago> metodos = metodoPagoRepository.findByUsuario_IdUsuario(idUsuario);
        return metodos.stream()
                .map(this::convertirADto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarMetodoPago(Long idMetodoPago) {
        if(!metodoPagoRepository.existsById(idMetodoPago)){
            throw new RuntimeException("No se puede eliminar: El método de pago con ID " + idMetodoPago + " no existe.");
        }
        metodoPagoRepository.deleteById(idMetodoPago);
    }

    @Override
    @Transactional
    public void eliminarTodosLosMetodosDeUsuario(Long idUsuario) {
        metodoPagoRepository.deleteByUsuario_IdUsuario(idUsuario);
    }

    @Override
    @Transactional
    public MetodoPagoResponseDTO actualizarMetodoPago(Long idMetodoPago, MetodoPago metodoPagoActualizado) {
        MetodoPago tarjetaExistente = metodoPagoRepository.findById(idMetodoPago)
                .orElseThrow(() -> new RuntimeException("No se encontró el método de pago con ID: " + idMetodoPago));

        if (metodoPagoActualizado.getNumTarjeta() != null) {
            tarjetaExistente.setNumTarjeta(metodoPagoActualizado.getNumTarjeta());
        }
        if (metodoPagoActualizado.getFechaExpiracion() != null) {
            tarjetaExistente.setFechaExpiracion(metodoPagoActualizado.getFechaExpiracion());
        }

        MetodoPago actualizado = metodoPagoRepository.save(tarjetaExistente);
        return convertirADto(actualizado);
    }
}