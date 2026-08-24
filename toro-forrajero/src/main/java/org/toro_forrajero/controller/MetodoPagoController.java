package org.toro_forrajero.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.model.MetodoPago;
import org.toro_forrajero.service.IMetodoPagoService;

import java.util.List;

@RestController
@RequestMapping("api/metodos-pago")
@RequiredArgsConstructor
public class MetodoPagoController {
    private final IMetodoPagoService metodoPagoService;


    // GET
    @GetMapping("usuario/{idUsuario}")
    public ResponseEntity<List<MetodoPago>> obtenerMetdodoPagoPorUsuario(@PathVariable Long idUsuario){
        return ResponseEntity.ok(metodoPagoService.obtenerMetodosPorUsuario(idUsuario));
    }

    // POST
    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<MetodoPago> agregarMetodoPago(
            @PathVariable Long idUsuario,
            @RequestBody MetodoPago metodoPago
    ){
        /**
         * Created: Regresa el 201. Indica que se creó en la base de datos
         * .body regresa en formato json lo que regresó el servicio
         */
        return ResponseEntity.status(HttpStatus.CREATED).body(metodoPagoService.agregarMetodoPago(metodoPago,idUsuario));
    }

    // DELETE
    @DeleteMapping("usuario/{idUsuario}")
    public ResponseEntity<Void> eliminarMetodoPago(@PathVariable Long idMetodoPago){
        metodoPagoService.eliminarMetodoPago(idMetodoPago);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/usuario/{idUsuario")
    public ResponseEntity<Void> eliminarTodosLosMetodosDeUsuario(@PathVariable Long idUsuario){
        metodoPagoService.eliminarTodosLosMetodosDeUsuario(idUsuario);
        return ResponseEntity.noContent().build();
    }

}
