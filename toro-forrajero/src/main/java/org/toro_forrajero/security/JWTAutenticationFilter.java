package org.toro_forrajero.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * FILTRO DE AUTENTICACIÓN JWT (El guardia de la puerta)
 *
 * Intercepta cada petición HTTP para verificar si el usuario envía un token válido
 * y registrar su sesión dentro de Spring Security.
 **/
@Component
public class JWTAutenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    // Inyección de dependencias para manejar tokens y buscar usuarios en la BD
    public JWTAutenticationFilter(JWTService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Extrae el encabezado "Authorization" de la petición HTTP entrante
        String authHeader = request.getHeader("Authorization");

        // Si no existe el encabezado o no empieza con "Bearer ", deja pasar la petición sin autenticar.
        // (Spring Security decidirá más adelante si la ruta era pública o requería acceso).
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extrae el token eliminando los primeros 7 caracteres ("Bearer ")
        String token = authHeader.substring(7);
        String username;

        // 3. Intenta leer el nombre de usuario/correo guardado dentro del token
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception exception) {
            // Si el token está expirado, alterado o la firma es inválida, detiene el proceso de autenticación
            // y continúa el flujo para que el servidor responda un error de acceso no autorizado.
            filterChain.doFilter(request, response);
            return;
        }

        // 4. Si el token tiene un usuario válido y la sesión NO ha sido registrada aún en esta petición
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Busca al usuario en la base de datos para obtener sus roles y credenciales
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Valida que el token pertenezca al usuario y que no haya caducado
            if (jwtService.isTokenValid(token, userDetails)) {

                // Crea el paquete oficial de autenticación de Spring Security con los datos y permisos del usuario
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Asigna detalles extra de la petición web (IP, ID de sesión, etc.)
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // REGISTRA AL USUARIO EN EL SISTEMA: A partir de este momento se le considera autenticado
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 5. Permite que la petición continúe hacia el controlador correspondiente (o siguiente filtro)
        filterChain.doFilter(request, response);
    }
}