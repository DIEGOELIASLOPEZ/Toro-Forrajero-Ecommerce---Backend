package org.toro_forrajero.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PedidoDTO {

    // REQUEST ADMIN: Para actualizar status, monto o fecha de entrega
    @Data
    public static class PedidoRequestAdmin {

        private LocalDateTime fechaEntrega;

        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        private BigDecimal montoTotal;

        private String status;

        @Min(value = 1, message = "El ID del método de pago debe ser mayor a 0")
        private Long idMetodoPago;
    }

    // REQUEST CLIENTE: Campos obligatorios para crear el pedido desde el frontend
    @Data
    public static class PedidoRequestCliente {

        @NotNull(message = "El monto debe ser obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        private BigDecimal montoTotal;

        @NotNull(message = "El ID del usuario es obligatorio")
        @Min(value = 1, message = "El ID usuario debe ser mayor a 0")
        private Long idUsuario;

        @NotNull(message = "El ID del método de pago es obligatorio")
        @Min(value = 1, message = "El ID del método de pago debe ser mayor a 0")
        private Long idMetodoPago;
    }

    // RESPONSE: Salida de datos hacia el cliente/frontend
    @Data
    public static class PedidoResponse {
        private Long idPedido;
        private LocalDateTime fechaPedido;
        private LocalDateTime fechaEntrega;
        private BigDecimal montoTotal;
        private String status;
        private Long idUsuario;
        private Long idMetodoPago;
    }
}