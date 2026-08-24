package org.toro_forrajero.controller;


import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.dto.UsuarioDTO;

import java.util.List;

@RestController
@RequestMapping("/appi/usuarios")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
@Data
public class UsuarioController {

    private final IUsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO.UsuarioResponse>> mostrarUsuarios(){
        return ResponseEntity.ok(usuarioService.mostrarUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO.UsuarioResponse> obtenerPorId(@PathVariable("id") Long id){
        return ResponseEntity.ok(usuarioService.mostrarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO.UsuarioResponse> crearUsuario(@Valid @RequestBody UsuarioDTO.UsuarioRequest usuarioRequest){
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crearUsuario(usuarioRequest));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO.UsuarioResponse> actualizarUsuario
            (@PathVariable Long id, @Valid @RequestBody UsuarioDTO.UsuarioRequest usuarioRequest){
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, usuarioRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable("id") Long id){
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

}
