package org.toro_forrajero.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
    public class Productos {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_Producto")
        private Long idProducto;

        @NotBlank(message = "El nombre es obligatorio")
        @Column(nullable = false, length = 50)
        private String nombre;

        @NotBlank(message = "La marca es obligatoria")
        @Column(nullable = false,length = 30)
        private String marca;

        @NotBlank(message = "La especie es obligatoria")
        @Column(nullable = false,length = 20)
        private String especie;

        @NotNull(message = "El stock es obligatorio")
        @Column(nullable = false)
        private Integer stock;

        @NotNull(message = "El costo es obligatorio")
        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal costo;

        @NotNull(message = "El precio de venta es obligatorio")
        @Column(name = "precio_venta", nullable = false, precision = 10, scale = 2)
        private BigDecimal precioVenta;


        @Column(nullable = false)
        private Boolean visibilidad;

        @Column(nullable = false)
        private Boolean destacado;

        @Column(nullable = false,columnDefinition = "TEXT")
        private String descripcion;






    }

