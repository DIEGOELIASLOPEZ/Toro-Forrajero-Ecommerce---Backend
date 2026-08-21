package org.toro_forrajero.model;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "productos")
    public class Productos {

        @Id
//        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_Producto")
        private Integer idProducto;

        @Column(nullable = false, length = 50)
        private String nombre;

        @Column(nullable = false,length = 30)
        private String marca;

        @Column(nullable = false,length = 20)
        private String especie;

        @Column(nullable = false)
        private Integer stock;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal costo;

        @Column(name = "precio_venta", nullable = false, precision = 10, scale = 2)
        private BigDecimal precioVenta;

        @Column(nullable = false)
        private Boolean visibilidad;

        @Column(nullable = false)
        private Boolean destacado;

        @Column(nullable = false,columnDefinition = "TEXT")
        private String descripcion;

        // Constructor vacío
        public Productos() {
        }

        // Constructor con parámetros
        public Productos(String nombre, String marca, String especie,
                        Integer stock, BigDecimal costo,
                        BigDecimal precioVenta, Boolean visibilidad,
                        Boolean destacado, String descripcion) {
            this.nombre = nombre;
            this.marca = marca;
            this.especie = especie;
            this.stock = stock;
            this.costo = costo;
            this.precioVenta = precioVenta;
            this.visibilidad = visibilidad;
            this.destacado = destacado;
            this.descripcion = descripcion;
        }

        // Getters y Setters

        public Integer getIdProducto() {
            return idProducto;
        }

        public void setIdProducto(Integer idProducto) {
            this.idProducto = idProducto;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getMarca() {
            return marca;
        }

        public void setMarca(String marca) {
            this.marca = marca;
        }

        public String getEspecie() {
            return especie;
        }

        public void setEspecie(String especie) {
            this.especie = especie;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }

        public BigDecimal getCosto() {
            return costo;
        }

        public void setCosto(BigDecimal costo) {
            this.costo = costo;
        }

        public BigDecimal getPrecioVenta() {
            return precioVenta;
        }

        public void setPrecioVenta(BigDecimal precioVenta) {
            this.precioVenta = precioVenta;
        }

        public Boolean getVisibilidad() {
            return visibilidad;
        }

        public void setVisibilidad(Boolean visibilidad) {
            this.visibilidad = visibilidad;
        }

        public Boolean getDestacado() {
            return destacado;
        }

        public void setDestacado(Boolean destacado) {
            this.destacado = destacado;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        @Override
        public String toString() {
            return "Producto{" +
                    "idProducto=" + idProducto +
                    ", nombre='" + nombre + '\'' +
                    ", marca='" + marca + '\'' +
                    ", especie='" + especie + '\'' +
                    ", stock=" + stock +
                    ", costo=" + costo +
                    ", precioVenta=" + precioVenta +
                    ", visibilidad=" + visibilidad +
                    ", destacado=" + destacado +
                    ", descripcion='" + descripcion + '\'' +
                    '}';
        }

    }

