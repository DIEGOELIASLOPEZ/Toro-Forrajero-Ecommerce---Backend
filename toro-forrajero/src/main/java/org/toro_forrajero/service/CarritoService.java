package org.toro_forrajero.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.toro_forrajero.dto.CarritoDTO;
import org.toro_forrajero.model.Carrito;
import org.toro_forrajero.repository.CarritoRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    // Obtener todos los carritos
    public List<CarritoDTO> obtenerTodos() {
        List<Carrito> listaCarrito = carritoRepository.findAll();
        List<CarritoDTO> listaDTO = new ArrayList<>();

        for (Carrito item : listaCarrito) {
            listaDTO.add(convertirADTO(item));
        }
        return listaDTO;
    }

    // Obtener carrito por ID de usuario
    public List<CarritoDTO> obtenerPorUsuario(Long usuarioId) {
        List<Carrito> listaCarrito = carritoRepository.findAll();
        List<CarritoDTO> listaDTO = new ArrayList<>();

        for (Carrito item : listaCarrito) {
            if (item.getUsuario() != null && item.getUsuario().getIdUsuario().equals(usuarioId)) {
                listaDTO.add(convertirADTO(item));
            }
        }
        return listaDTO;
    }

    // Guardar o actualizar un carrito
    public CarritoDTO guardar(Carrito itemCarrito) {
        Carrito guardado = carritoRepository.save(itemCarrito);
        return convertirADTO(guardado);
    }

    // Eliminar un carrito por su ID
    public void eliminarPorId(Long id) {
        carritoRepository.deleteById(id);
    }

    // Vaciar carritos
    public void vaciarCarrito() {
        carritoRepository.deleteAll();
    }

    // Método auxiliar para mapear de Entidad Carrito a DTO
    private CarritoDTO convertirADTO(Carrito carrito) {
        CarritoDTO dto = new CarritoDTO();
        dto.setId(carrito.getIdCarrito());

        if (carrito.getUsuario() != null) {
            dto.setUsuarioId(carrito.getUsuario().getIdUsuario());
        }
        return dto;
    }
}