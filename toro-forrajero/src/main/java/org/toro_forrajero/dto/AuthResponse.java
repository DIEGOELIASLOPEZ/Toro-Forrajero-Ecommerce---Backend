package org.toro_forrajero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO que empaqueta la respuesta del backend tras un login exitoso.
 *
 * Contiene el Token JWT generado y sus datos de validez para que el
 * cliente (Frontend/Postman) los guarde y los use en peticiones futuras.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {

    // El token JWT generado (la "llave" de acceso)
    private String token;

    // Tipo de token (por estándar siempre es "Bearer")
    private String tokenType;

    // Tiempo de vida del token en milisegundos
    private Long expireInMs;
}