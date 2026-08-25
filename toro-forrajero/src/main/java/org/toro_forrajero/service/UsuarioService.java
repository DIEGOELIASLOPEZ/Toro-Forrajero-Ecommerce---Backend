package org.toro_forrajero.service;


import org.springframework.stereotype.Service;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.UsuarioRepository;
import org.toro_forrajero.dto.UsuarioDTO;


import java.util.List;

@Service
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    //Constructor
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    //Obtener todos los usuarios
    @Override
    public List<UsuarioDTO.UsuarioResponse> mostrarUsuarios(){
        return usuarioRepository.findAll().stream().map(this::entidadAResponse).toList();
    }

    @Override
    public UsuarioDTO.UsuarioResponse mostrarPorId (Long id){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario con ID " + id + " no encontrado"));
        return entidadAResponse(usuario);
    }

    @Override
    public UsuarioDTO.UsuarioResponse crearUsuario(UsuarioDTO.UsuarioRequest usuarioRequest){
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioRequest.getNombre());
        usuario.setApellido(usuarioRequest.getApellido());
        usuario.setTelefono(usuarioRequest.getTelefono());
        usuario.setAreaInteres(usuarioRequest.getAreaInteres());
        usuario.setCorreo(usuarioRequest.getCorreo());
        usuario.setEstado(usuarioRequest.getEstado());
        usuario.setContrasena(usuarioRequest.getContrasena());

        Usuario usuarioModificado = usuarioRepository.save(usuario);
        return entidadAResponse(usuarioModificado);

    }

    @Override
    public UsuarioDTO.UsuarioResponse actualizarUsuario(Long id, UsuarioDTO.UsuarioRequest usuarioRequest){
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario con ID " + id + " no encontrado"));
        usuario.setNombre(usuarioRequest.getNombre());
        usuario.setApellido(usuarioRequest.getApellido());
        usuario.setTelefono(usuarioRequest.getTelefono());
        usuario.setAreaInteres(usuarioRequest.getAreaInteres());
        usuario.setCorreo(usuarioRequest.getCorreo());
        usuario.setEstado(usuarioRequest.getEstado());
        usuario.setContrasena(usuarioRequest.getContrasena());

        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        return entidadAResponse(usuarioActualizado);
    }

    @Override
    public void eliminarUsuario(Long id){
        if (!usuarioRepository.existsById(id)){
            throw new RuntimeException("Usuario con ID " + id + " no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    @Override
    public UsuarioDTO.UsuarioResponse mostrarPorCorreo(String correo){
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario con correo " + correo + " no encontrado"));
        return entidadAResponse(usuario);
    }

    @Override
    public boolean existePorCorreo(String correo){
        return usuarioRepository.existsByCorreo(correo);
    }

    private UsuarioDTO.UsuarioResponse entidadAResponse(Usuario usuario){
        UsuarioDTO.UsuarioResponse usuarioResponse = new UsuarioDTO.UsuarioResponse();
        usuarioResponse.setIdUsuario(usuario.getIdUsuario());
        usuarioResponse.setNombre(usuario.getNombre());
        usuarioResponse.setApellido(usuario.getApellido());
        usuarioResponse.setTelefono(usuario.getTelefono());
        usuarioResponse.setAreaInteres(usuario.getAreaInteres());
        usuarioResponse.setCorreo(usuario.getCorreo());
        usuarioResponse.setEstado(usuario.getEstado());

        return usuarioResponse;
    }
}