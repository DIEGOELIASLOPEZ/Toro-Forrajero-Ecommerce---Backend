package org.toro_forrajero.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.toro_forrajero.model.converter.YearMonthConverter;

import java.time.YearMonth;

/*
 * @Index es para acelerar las búsquedas que se hacen en la base de datos
 * Se usa la de id_usuario debido a que id_usuario se usa para hacer búsquedas
 * y unir tablas
 */
@Entity
@Table(
        name = "metodo_pago",
        indexes = @Index(
                name = "idx_metodo_pago_id_usuario",
                columnList = "id_usuario"
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetodoPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_metodo_pago")
    private Long idMetodoPago;

    @Column(name = "num_tarjeta", nullable = false, length = 100)
    private String numTarjeta;

    /**
     * Convertidor. Es para guardar la fecha en String, para que SQL pueda guardarlo
     * Al consultarlo, el convertidor lo devuelve en formato YearMonth
     */
    @Convert(converter = YearMonthConverter.class)
    @Column(name = "fecha_expiracion", nullable = false, length = 7)
    private YearMonth fechaExpiracion;

    /**
     * @foreignKey le pone nombre a la restricción de la llave foránea
     * @ManyToOne significa que muchos métodos de pago pueden pertenecer a un usuario
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "id_usuario",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_metodo_pago_usuario")
    )
    private Usuario usuario;
}