package org.toro_forrajero.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "detalle_carrito")
@Getter
@Setter
@NoArgsConstructor
public class DetalleCarrito {

    @EmbeddedId
    private DetalleCarritoId id = new DetalleCarritoId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCarrito")
    @JoinColumn(name = "id_carrito", foreignKey = @ForeignKey(name = "fk_detalle_carrito_carrito1"))
    private Carrito carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProducto")
    @JoinColumn(name = "id_producto", foreignKey = @ForeignKey(name = "fk_detalle_carrito_productos1"))
    private Productos producto;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad = 1;
}