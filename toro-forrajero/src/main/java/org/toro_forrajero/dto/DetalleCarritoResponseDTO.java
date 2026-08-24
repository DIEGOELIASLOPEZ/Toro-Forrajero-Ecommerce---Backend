package org.toro_forrajero.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleCarritoResponseDTO {
    private Long idCarrito;
    private Long idProducto;
    private String nombreProducto; // Para que el usuario vea qué compró
    private BigDecimal precioUnitario; // O el tipo de dato que uses en tu entidad Productos
    private Integer cantidad;
    private BigDecimal subtotal; // Cantidad * Precio
}