package org.toro_forrajero.service;

import java.util.List;
import org.toro_forrajero.dto.UsuarioDTO;

public interface IUsuarioService {

    List<UsuarioDTO.UsuarioResponse> mostrarUsuarios();

    UsuarioDTO.UsuarioResponse mostrarPorId(Long id);

    UsuarioDTO.UsuarioResponse crearUsuario(UsuarioDTO.UsuarioRequest usuarioRequest);

    UsuarioDTO.UsuarioResponse actualizarUsuario(Long id, UsuarioDTO.UsuarioRequest usuarioRequest);

    void eliminarUsuario(Long id);

    UsuarioDTO.UsuarioResponse mostrarPorCorreo(String correo);

    boolean existePorCorreo(String correo);
}