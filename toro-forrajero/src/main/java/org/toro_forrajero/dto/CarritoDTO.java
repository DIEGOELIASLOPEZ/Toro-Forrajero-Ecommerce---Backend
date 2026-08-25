package org.toro_forrajero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoDTO {

    private Long id;
    private Long usuarioId;
    private Long productoId;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}