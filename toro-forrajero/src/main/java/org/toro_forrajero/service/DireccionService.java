package org.toro_forrajero.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.toro_forrajero.model.Direccion;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.DireccionRepository;
import org.toro_forrajero.repository.UsuarioRepository;

import java.util.List;

@Service
public class DireccionService implements IDireccionService {

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;


    @Override
    public Direccion crearDireccion(Direccion direccion, Long idUsuario) {

        if (verificarDireccion(
                idUsuario,
                direccion.getCalle(),
                direccion.getNumExterior(),
                direccion.getCodigoPostal())) {

            List<Direccion> direcciones = direccionRepository.findByUsuario_IdUsuario(idUsuario);
            return direcciones.stream()
                    .filter(d -> d.getCalle().equalsIgnoreCase(direccion.getCalle())
                            && d.getNumExterior().equalsIgnoreCase(direccion.getNumExterior())
                            && d.getCodigoPostal().equalsIgnoreCase(direccion.getCodigoPostal()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Esta dirección ya existe"));
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        direccion.setUsuario(usuario);

        return direccionRepository.save(direccion);
    }


    @Override
    public List<Direccion> mostrarDireccion(Long idUsuario) {
        return direccionRepository.findByUsuario_IdUsuario(idUsuario);
    }


    @Override
    public long contarDireccion(Long idUsuario) {
        return direccionRepository.countByUsuario_IdUsuario(idUsuario);
    }


    @Override
    public boolean verificarDireccion(
            Long idUsuario,
            String calle,
            String numExterior,
            String codigoPostal) {

        List<Direccion> direcciones =
                direccionRepository.findByUsuario_IdUsuario(idUsuario);

        for (Direccion direccion : direcciones) {

            if (direccion.getCalle().equalsIgnoreCase(calle)
                    && direccion.getNumExterior().equalsIgnoreCase(numExterior)
                    && direccion.getCodigoPostal().equalsIgnoreCase(codigoPostal)) {

                return true;
            }
        }

        return false;
    }


    @Override
    public void eliminarDireccion(Long idUsuario, Long idDireccion) {

        Direccion direccion = direccionRepository.findById(idDireccion)
                .orElseThrow(() ->
                        new RuntimeException("Dirección no encontrada"));

        if (!direccion.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException(
                    "La dirección no pertenece al usuario");
        }

        direccionRepository.delete(direccion);
    }


    @Override
    public void eliminarDireccionesDeUsuario(Long idUsuario) {

        List<Direccion> direcciones =
                direccionRepository.findByUsuario_IdUsuario(idUsuario);

        direccionRepository.deleteAll(direcciones);
    }
}