package org.toro_forrajero.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Usuario;

import java.util.List;
import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    //Verificar si existe el correo
    boolean existsByCorreo(String correo);

    // Buscar el Usuario por correo:
    Optional<Usuario> findByCorreo(Long id_usuario);

    // Mostrar clientes o administradores por Id y rol:
    List<Usuario> findByIdAndRolIgnoreCase(Long id_usuario, String rol);

    // Filtro para identificar mayor demanda en Estado:
    List<Usuario> findByEstadoIgnoreCase(String estado);

    //Para segmentar usuarios según sus preferencias de insumos/ganado
    List<Usuario> findByAreaInteresIgnoreCase(String areaInteres);


}
