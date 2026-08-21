package org.toro_forrajero.model;
import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;


// Creamos tabla direccion
@Entity
@Table(name = "Direccion")
@Data // GENERA SETTER AND GETTER
@NoArgsConstructor
@AllArgsConstructor// CONSTRUCTOR ARGUMENTOS

//Agregamos atributos
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  // calle
    @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private String  calle;
// numExterior
    @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private int numExterior;
    @Column
     private int numInterior;
 // CP
    @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private int codigoPostal;
 // Acaldia
    @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private String acaldia;
 //   Estado
    @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private String estado;
 // Tel
     @NotBlank(message = "Este campo no puede ester vacio ")
    @Column(nullable = false)
     private String tel;
     //email
    @NotBlank(message = "El email no puede estar vacio")
    @Column(nullable = false, length = 100 , unique = true)
    @Email(message = "Email debe ser válido.")
     private String email;


    // CARDINALIDAD
    //un usuario  tienen muchas direcciones

    @ManyToOne(optional = false)
    // esta es mi FOREINGKEY
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario ;

    // HACEMOS CONSTRUCTORES CON ETIQUETA, GET Y SET


}
