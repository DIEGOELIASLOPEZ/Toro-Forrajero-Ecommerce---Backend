package org.toro_forrajero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.dto.MetodoPagoResponseDTO;
import org.toro_forrajero.model.MetodoPago;
import org.toro_forrajero.service.IMetodoPagoService;

import java.util.List;

@RestController
@RequestMapping("api/metodos-pago")
@RequiredArgsConstructor
public class MetodoPagoController {

    private final IMetodoPagoService metodoPagoService;

    // GET
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MetodoPagoResponseDTO>> obtenerMetodoPagoPorUsuario(@PathVariable Long idUsuario){
        return ResponseEntity.ok(metodoPagoService.obtenerMetodosPorUsuario(idUsuario));
    }

    // POST
    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<MetodoPagoResponseDTO> agregarMetodoPago(
            @PathVariable Long idUsuario,
            @RequestBody MetodoPago metodoPago
    ){
        return ResponseEntity.status(HttpStatus.CREATED).body(metodoPagoService.agregarMetodoPago(metodoPago, idUsuario));
    }

    // PUT
    @PutMapping("/{idMetodoPago}")
    public ResponseEntity<MetodoPagoResponseDTO> actualizarMetodoPago(
            @PathVariable Long idMetodoPago,
            @RequestBody MetodoPago metodoPagoActualizado
    ) {
        MetodoPagoResponseDTO tarjetaModificada = metodoPagoService.actualizarMetodoPago(idMetodoPago, metodoPagoActualizado);
        return ResponseEntity.ok(tarjetaModificada);
    }
}