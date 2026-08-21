package org.toro_forrajero.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_carrito")
public class DetalleCarrito {

    /*
     * @EmbeddedId Indica que la entidad tiene una llave primaria compuesta
     */
    @EmbeddedId
    private DetalleCarritoId id = new DetalleCarritoId();

    /**
     * @MapsId es una anotación que vincula los atributos de la
     * llave compuesta con las relaciones
     * Es una llave fóranea y parte de la llave primaria
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idCarrito")
    @JoinColumn(name = "id_carrito", foreignKey = @ForeignKey(name = "fk_detalle_carrito_carrito1"))
    private Carrito carrito;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idProducto")
    @JoinColumn(name = "id_producto", foreignKey = @ForeignKey(name = "fk_detalle_carrito_productos1"))
    private Productos producto; // Ajustado al nombre de tu entidad de productos

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad = 1;

    // Constructor vacío
    public DetalleCarrito() {}

    // Getters y Setters
    public DetalleCarritoId getId() { return id; }
    public void setId(DetalleCarritoId id) { this.id = id; }

    public Carrito getCarrito() { return carrito; }
    public void setCarrito(Carrito carrito) { this.carrito = carrito; }

    public Productos getProducto() { return producto; }
    public void setProducto(Productos producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}