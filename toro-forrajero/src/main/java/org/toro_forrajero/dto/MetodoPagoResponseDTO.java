package org.toro_forrajero.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.YearMonth;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetodoPagoResponseDTO {
    private Long idMetodoPago;
    private String numTarjeta;

    @JsonFormat(pattern = "MM/yyyy")
    private YearMonth fechaExpiracion;

    private Long idUsuario; // Mandamos solo el ID del usuario limpiamente
}