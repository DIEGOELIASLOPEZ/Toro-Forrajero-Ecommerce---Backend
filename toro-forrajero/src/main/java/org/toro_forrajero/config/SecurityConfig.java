package org.toro_forrajero.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.toro_forrajero.repository.UsuarioRepository;
import org.toro_forrajero.security.JWTAutenticationFilter;

// -- /auth/login : es público
// -- /api/*** : esto queda protegido
// -- Filtro JWT debe correr antes del filtro estándar

@Configuration
public class SecurityConfig {

    // Configuramos las reglas de seguridad de la aplicación
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JWTAutenticationFilter jwtFilter
    ) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) // Desactivamos CSRF al ser una API Stateless
                .sessionManagement(sesion ->
                        sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sin sesiones HTTP
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/login", "/error").permitAll() // Rutas públicas
                        .anyRequest().authenticated())                       // Cualquier otra requiere JWT
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Se requiere un JWT válido\"}");
                        }))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Filtro personalizado JWT
                .build();
    }

    // Busca al usuario en la base de datos MySQL por su correo
    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
        return username -> usuarioRepository.findByCorreo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + username));
    }

    // Administrador de autenticación para validar las credenciales en el Login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Encriptador de contraseñas usando BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}