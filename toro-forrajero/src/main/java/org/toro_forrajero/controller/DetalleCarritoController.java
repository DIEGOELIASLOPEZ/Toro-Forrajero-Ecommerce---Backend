package org.toro_forrajero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.dto.DetalleCarritoResponseDTO;
import org.toro_forrajero.service.IDetalleCarritoService;

import java.util.List;

@RestController
@RequestMapping("api/detalle-carrito")
@CrossOrigin(origins = "*") // Permite peticiones desde el frontend
@RequiredArgsConstructor
public class DetalleCarritoController {

    private final IDetalleCarritoService detalleCarritoService;

    @GetMapping("/{idCarrito}/detalles")
    public ResponseEntity<List<DetalleCarritoResponseDTO>> obtenerDetallesCarrito(@PathVariable Long idCarrito){
        return ResponseEntity.ok(detalleCarritoService.obtenerDetallesDeCarrito(idCarrito));
    }

    @PostMapping("/{idCarrito}/producto/{idProducto}")
    public ResponseEntity<DetalleCarritoResponseDTO> agregarProducto(
            @PathVariable Long idCarrito,
            @PathVariable Long idProducto,
            @RequestParam(defaultValue = "1") Integer cantidad){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(detalleCarritoService.agregarProducto(idCarrito, idProducto, cantidad));
    }

    @DeleteMapping("/{idCarrito}/producto/{idProducto}")
    public ResponseEntity<Void> eliminarProductoCarrito(@PathVariable Long idCarrito, @PathVariable Long idProducto){
        detalleCarritoService.eliminarProductoDeCarrito(idCarrito, idProducto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{idCarrito}/vaciar")
    public ResponseEntity<Void> vaciarCarrito(@PathVariable Long idCarrito){
        detalleCarritoService.vaciarCarrito(idCarrito);
        return ResponseEntity.noContent().build();
    }
}