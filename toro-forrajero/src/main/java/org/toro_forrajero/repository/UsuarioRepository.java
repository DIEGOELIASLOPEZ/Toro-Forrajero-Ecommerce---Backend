package org.toro_forrajero.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.toro_forrajero.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
