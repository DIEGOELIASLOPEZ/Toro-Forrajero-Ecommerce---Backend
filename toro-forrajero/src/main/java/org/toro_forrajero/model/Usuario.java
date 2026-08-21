package org.toro_forrajero.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuario")
@Data // Getters, Setter, ToString, equals
@NoArgsConstructor //Crear Constructor Vacio
@AllArgsConstructor //Crear Constructor con parametros
@Builder


public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Column(name = "nombre", nullable = false)
    private String apellido;

    @NotBlank(message = "El teléfono es obligatorio")
    @Column(name = "telefono", nullable = false)
    private String telefono;

    @NotBlank(message = "El área de interés es obligatorio")
    @Column(name = "area_interes", nullable = false)
    private String areaInteres;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Debe proporcionar un formato de correo válido")
    @Column(name = "correo", nullable = false)
    private String correo;

    @NotBlank(message = "El estado es obligatorio")
    @Column(name = "estado", nullable = false)
    private String estado;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "rol", nullable = false, columnDefinition = "ENUM('cliente', 'admin') DEFAULT 'cliente'")
    private String rol = "cliente";

}
