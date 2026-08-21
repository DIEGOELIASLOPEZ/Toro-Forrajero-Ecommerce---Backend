package org.toro_forrajero.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

/**
 * Cuando se tienen tablas compuestas, es necesario
 * crear una clase con la llave combinada
 * @Embeddable indica que va estar dentro de otra entidad como llave
 * @Equals and hashCode se usan para saber si un registro existe
 * o si ha cambiado
 */

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class DetalleCarritoId implements Serializable {
    private Long idCarrito;
    private Long idProducto;
}