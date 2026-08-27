package org.toro_forrajero.model;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "direccion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {

    //ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_direccion")
    private Long idDireccion;
 //CALLE
    @NotBlank(message = "La calle no puede estar vacía")
    @Column(nullable = false, length = 100)
    private String calle;
 //NUMEXT
    @NotBlank(message = "El número exterior no puede estar vacío")
    @Column(name = "num_exterior", nullable = false, length = 10)
    private String numExterior;

    // NUMINTE
    @Column(name = "num_interior", length = 10)
    private String numInterior;

    // CP
    @NotBlank(message = "El código postal no puede estar vacío")
    @Pattern(regexp = "\\d{5}", message = "El código postal debe contener 5 dígitos")
    @Column(name = "codigo_postal", nullable = false, length = 10)
    private String codigoPostal;
 //acaldia
    @NotBlank(message = "La alcaldía/municipio no puede estar vacía")
    @Column(name = "alcaldia", nullable = false, length = 100)
    private String alcaldia;
//estado
    @NotBlank(message = "El estado no puede estar vacío")
    @Column(nullable = false, length = 50)
    private String estado;
//tel
    @NotBlank(message = "El teléfono no puede estar vacío")
    @Column(nullable = false, length = 15)
    private String tel;
//email
    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "El email debe ser válido.")
    @Column(nullable = false, length = 100)
    private String email;
//relaciones

    @JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

}