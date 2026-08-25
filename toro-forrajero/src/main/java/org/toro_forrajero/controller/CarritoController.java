package org.toro_forrajero.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.dto.CarritoDTO;
import org.toro_forrajero.model.Carrito;
import org.toro_forrajero.service.CarritoService;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    // GET: Obtener todos los productos en el carrito
    @GetMapping
    public ResponseEntity<List<CarritoDTO>> obtenerCarrito() {
        List<CarritoDTO> items = carritoService.obtenerTodos();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    // GET: Obtener el carrito de un usuario específico (/api/carrito/usuario/1)
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CarritoDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<CarritoDTO> items = carritoService.obtenerPorUsuario(usuarioId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    // POST: Agregar un nuevo elemento al carrito
    @PostMapping
    public ResponseEntity<CarritoDTO> agregarAlCarrito(@RequestBody Carrito carrito) {
        CarritoDTO nuevoItem = carritoService.guardar(carrito);
        return new ResponseEntity<>(nuevoItem, HttpStatus.CREATED);
    }

    // DELETE: Eliminar un producto del carrito por su ID (/api/carrito/1)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarItem(@PathVariable Long id) {
        carritoService.eliminarPorId(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // DELETE: Vaciar todo el carrito (/api/carrito/limpiar)
    @DeleteMapping("/limpiar")
    public ResponseEntity<Void> vaciarCarrito() {
        carritoService.vaciarCarrito();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
