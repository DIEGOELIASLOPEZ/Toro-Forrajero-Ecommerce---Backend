package org.toro_forrajero.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

/**
 * Centraliza la lógica para CREAR, LEER y VALIDAR JWT.
 *
 * Funciona como la "máquina de sellos" de la aplicación: empaqueta
 * la información del usuario en un token firmado y verifica su validez.
 **/
@Service
public class JWTService {

    // Clave secreta codificada en Base64 para firmar y validar tokens de forma segura
    public static final String SECRET_KET =
            "bWktbGxhdmUtc2VjcmV0YS1wYXJhLWRlbW8tamF2YS1zcHJpbmctc2VjdXJpdHktand0LTIwMjY=";

    // Tiempo de expiración del token (15 minutos en ms)
    private static final long EXPIRATION_TIME_MS = 1000L * 60 * 15;

    // =========================================================================
    // 1. MÉTODOS PÚBLICOS PRINCIPALES (Creación, Validación y Configuración)
    // =========================================================================

    /**
     * Devuelve el tiempo de vida del token en milisegundos para el Frontend.
     */
    public static long getExpirationTimeMs() {
        return EXPIRATION_TIME_MS;
    }

    /**
     * Construye y firma un Token JWT para un usuario autenticado.
     */
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiration = new Date(System.currentTimeMillis() + EXPIRATION_TIME_MS);

        return Jwts.builder()
                .subject(userDetails.getUsername())     // Asigna el correo/usuario como dueño del token
                .issuedAt(now)                          // Fecha de emisión
                .expiration(expiration)                 // Fecha de caducidad

                .signWith(getSigningKey())              // Firma criptográfica - Sirve como candado de seguridad.
                                                        // Toma los datos anteriores (usuario, fecha de inicio y expiración) y los procesa con tu SECRET_KEY.
                                                        // Si alguien intenta modificar el usuario dentro del token para hacerse pasar por otro,
                                                        // la firma deja de coincidir y el backend lo detecta al instante.

                .compact();                             // Metodo que empaqueta  en una sola cadena de texto separada por dos puntos (ejemplo: eyJhbGciOi...).
                                                        // Es el formato estandarizado que el servidor le responde al usuario en el AuthResponse para que el navegador
                                                        // lo la app lo guarde.
    }

    /**
     * Comprueba si el token le pertenece al usuario actual y si aún sigue vigente.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // =========================================================================
    // 2. MÉTODOS PÚBLICOS DE EXTRACTION (Lectura de datos del Token)
    // =========================================================================

    /**
     * Extrae el correo/username contenido dentro del token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Metodo generico para extraer un dato específico (Claim) de la lista global de datos del token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    // =========================================================================
    // 3. MÉTODOS PRIVADOS AUXILIARES (Soporte interno de la clase)
    // =========================================================================

    /**
     * Verifica si la fecha de expiración del token ya pasó respecto a la hora actual.
     */
    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    /**
     * Abre el token usando la firma secreta y extrae todos sus datos (Payload).
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Decodifica la clave Base64 y la transforma en una SecretKey reconocible por JJWT.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}