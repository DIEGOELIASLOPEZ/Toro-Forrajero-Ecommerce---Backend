package org.toro_forrajero.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.toro_forrajero.dto.DetallePedidoDTO;
import org.toro_forrajero.service.IDetallePedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
@CrossOrigin(origins = "*")
public class DetallePedidoController {

    @Autowired
    private IDetallePedidoService detallePedidoService;

    @GetMapping
    public ResponseEntity<List<DetallePedidoDTO>> obtenerTodos() {
        return ResponseEntity.ok(detallePedidoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedidoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(detallePedidoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<DetallePedidoDTO> guardar(@RequestBody DetallePedidoDTO detallePedidoDTO) {
        DetallePedidoDTO nuevoDetalle = detallePedidoService.guardar(detallePedidoDTO);
        return new ResponseEntity<>(nuevoDetalle, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetallePedidoDTO> actualizar(
            @PathVariable Long id,
            @RequestBody DetallePedidoDTO detallePedidoDTO) {
        return ResponseEntity.ok(detallePedidoService.actualizar(id, detallePedidoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        detallePedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}