package org.toro_forrajero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "pedido")
@Data // Getters, Setter, ToString, equals
@NoArgsConstructor //Crear Constructor Vacio
@AllArgsConstructor //Crear Constructor con parametros
@Builder
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long idPedido;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_pedido", nullable = false)
    private Date fechaPedido;

    @NotNull(message = "El monto debe ser obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @NotNull(message = "Status Obligatorio")
    @Column(name = "status", nullable = false)
    private String status;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Min(value = 1, message = "El ID usuario debe ser mayor a 0")
    @Column(name = "id_usuario", nullable = false)
    private Long idUsuario;

    @NotBlank(message = "Se requiere un metodo de pago obligatorio")
    @Column(name = "metodo_pago", nullable = false)
    private String metodoPago;


    @NotNull(message = "El ID de la dirección es obligatorio")
    @Min(value = 1, message = "La ID de la direccion debe ser mayor a 0")
    @Column(name = "id_direccion", nullable = false)
    private Long idDireccion;



}
