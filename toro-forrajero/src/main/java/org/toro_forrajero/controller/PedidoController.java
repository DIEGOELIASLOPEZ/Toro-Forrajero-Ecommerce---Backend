package org.toro_forrajero.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.toro_forrajero.dto.PedidoDTO;
import org.toro_forrajero.service.IPedidoService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/pedidos")
@CrossOrigin(origins = {"http//127.0.0.1:5500/", "http//localhost:5500"} )
public class PedidoController {

    private final IPedidoService pedidoService;

    // --- GETS ---

    @GetMapping
    public ResponseEntity<List<PedidoDTO.PedidoResponse>> mostrarPedidos() {
        return ResponseEntity.ok(pedidoService.mostrarPedidos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO.PedidoResponse> mostrarPedidoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.mostrarPedidoPorId(id));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<PedidoDTO.PedidoResponse>> mostrarPedidosDeUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(pedidoService.mostrarPedidosDeUsuario(idUsuario));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<PedidoDTO.PedidoResponse>> mostrarPedidosEntreFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(pedidoService.mostrarPedidosEntreFechas(fechaInicio, fechaFin));
    }

    // --- POST ---

    @PostMapping
    public ResponseEntity<PedidoDTO.PedidoResponse> crearPedido(@Valid @RequestBody PedidoDTO.PedidoRequestCliente nuevoPedido) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crearPedido(nuevoPedido));
    }

    // --- PUT ---

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO.PedidoResponse> modificarPedido(
            @PathVariable Long id,
            @Valid @RequestBody PedidoDTO.PedidoRequestAdmin pedidoExistente) {
        return ResponseEntity.ok(pedidoService.modificarPedido(id, pedidoExistente));
    }

    // --- PATCHS ---

    // PATCH /pedidos/1/status?status=Entregado
    @PatchMapping("/{id}/status")
    public ResponseEntity<PedidoDTO.PedidoResponse> modificarStatusPedido(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(pedidoService.modificarStatusPedido(id, status));
    }

    // PATCH /pedidos/1/fecha-entrega?fechaNueva=2026-08-30T15:00:00
    @PatchMapping("/{id}/fecha-entrega")
    public ResponseEntity<PedidoDTO.PedidoResponse> modificarFechaEntregaPedido(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaNueva) {
        return ResponseEntity.ok(pedidoService.modificarFechaEntregaPedido(id, fechaNueva));
    }

    // PATCH /pedidos/1/cancelar
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<PedidoDTO.PedidoResponse> cancelarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.cancelarPedido(id));
    }
}