package org.toro_forrajero.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.model.Direccion;
import org.toro_forrajero.service.DireccionService;

import java.util.List;


@RestController
@RequestMapping("/api/direcciones")


public class DireccionController {
    @Autowired



    private DireccionService direccionService;

    // --- GET ---

    //Devuelve todas las direcciones registradas de un usuario//

    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<Direccion>> mostrarDireccion(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(direccionService.mostrarDireccion(idUsuario));
    }

    //Devuelve todas las direcciones registradas de un usuario//

    @GetMapping("/{idUsuario}/count")
    public ResponseEntity<Long> contarDirecciones(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(direccionService.contarDireccion(idUsuario));
    }

    // --- POST ---
    //Agrega una direccion nueva //

    @PostMapping("/{idUsuario}")
    public ResponseEntity<Direccion> crearDireccion(
            @PathVariable Long idUsuario,
            @RequestBody Direccion direccion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(direccionService.crearDireccion(direccion, idUsuario));
    }

    // --- DELETE ---
    // Eliminar una dirección puntual de un usuario
    @DeleteMapping("/{idUsuario}/{idDireccion}")
    public ResponseEntity<Void> eliminarDireccion(
            @PathVariable Long idUsuario,
            @PathVariable Long idDireccion) {
        direccionService.eliminarDireccion(idUsuario, idDireccion);
        return ResponseEntity.noContent().build();
    }

    // Eliminar todas las direcciones de un usuario

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> eliminarDireccionesDeUsuario(@PathVariable Long idUsuario) {
        direccionService.eliminarDireccionesDeUsuario(idUsuario);
        return ResponseEntity.noContent().build();
    }
}



