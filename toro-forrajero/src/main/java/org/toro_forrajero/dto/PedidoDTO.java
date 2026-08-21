package org.toro_forrajero.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

public class PedidoDTO {

    // REQUEST ADMIN: Permite actualizaciones parciales (campos opcionales)
    @Data
    public static class PedidoRequestAdmin {

        private Date fechaPedido;

        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        private BigDecimal montoTotal;

        private String status;

        private String metodoPago;

        @Min(value = 1, message = "El ID de la dirección debe ser mayor a 0")
        private Long idDireccion;
    }

    // REQUEST CLIENTE: Campos obligatorios para crear el pedido
    @Data
    public static class PedidoRequestCliente {

        @NotNull(message = "El monto debe ser obligatorio")
        @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
        private BigDecimal montoTotal;

        @NotNull(message = "El ID del usuario es obligatorio")
        @Min(value = 1, message = "El ID usuario debe ser mayor a 0")
        private Long idUsuario;

        @NotBlank(message = "Se requiere un metodo de pago obligatorio")
        private String metodoPago;

        @NotNull(message = "El ID de la dirección es obligatorio")
        @Min(value = 1, message = "La ID de la direccion debe ser mayor a 0")
        private Long idDireccion;
    }

    // RESPONSE: Salida de datos hacia el frontend
    @Data
    public static class PedidoResponse {
        private Long idPedido;
        private Date fechaPedido;
        private BigDecimal montoTotal;
        private String status;
        private Long idUsuario;
        private String metodoPago;
        private Long idDireccion;
    }

}