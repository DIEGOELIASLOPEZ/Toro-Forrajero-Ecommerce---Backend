package org.toro_forrajero.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.toro_forrajero.model.Usuario;
import org.toro_forrajero.repository.UsuarioRepository;
import org.toro_forrajero.dto.UsuarioDTO;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor con inyección de dependencias
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Obtener todos los usuarios
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


        usuario.setContrasena(passwordEncoder.encode(usuarioRequest.getContrasena()));

        // Asignar rol si viene en la petición, si no, se queda con el valor por defecto de la entidad ("cliente")
        if (usuarioRequest.getRol() != null && !usuarioRequest.getRol().isEmpty()) {
            usuario.setRol(usuarioRequest.getRol());
        }

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

        if (usuarioRequest.getContrasena() != null && !usuarioRequest.getContrasena().isEmpty()) {
            usuario.setContrasena(passwordEncoder.encode(usuarioRequest.getContrasena()));
        }

        if (usuarioRequest.getRol() != null) {
            usuario.setRol(usuarioRequest.getRol());
        }

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

    @Override
    public UsuarioDTO.UsuarioResponse autenticar(String correo, String contrasenaIngresada) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreo(correo);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Compara la contraseña ingresada con el hash de la base de datos de forma segura
            if (passwordEncoder.matches(contrasenaIngresada, usuario.getContrasena())) {
                return entidadAResponse(usuario);
            }
        }
        return null;
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
        usuarioResponse.setRol(usuario.getRol());

        return usuarioResponse;
    }
}