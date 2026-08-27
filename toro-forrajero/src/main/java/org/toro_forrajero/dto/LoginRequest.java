package org.toro_forrajero.dto;


import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que recibe las credenciales del usuario desde el Frontend.
 *
 * Es la clase donde defines la forma y el tipo de datos (en este caso, user y password) que se le van a pedir
 * al usuario para que se pueda autenticar. Es simplemente el molde de las credenciales de entrada.
 */
@Data // Getters, Setters, toString, equals y hashCode
@NoArgsConstructor // Constructor vacío

public class LoginRequest {

    private String user;
    private String password;


}
