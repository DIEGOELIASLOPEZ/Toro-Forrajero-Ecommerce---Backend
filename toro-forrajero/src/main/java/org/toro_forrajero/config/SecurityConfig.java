package org.toro_forrajero.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.toro_forrajero.security.JWTAutenticationFilter;

@Configuration
public class SecurityConfig {

    // Configuramos las reglas de seguridad de la aplicación
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JWTAutenticationFilter jwtFilter
    ) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sesion ->
                        sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rutas estáticas, auth y todos los endpoints de la API totalmente públicos
                        .requestMatchers(
                                "/",
                                "/*.html",
                                "/build/**",
                                "/img/**",
                                "/recursos-graficos/**",
                                "/database/**",
                                "/auth/login",
                                "/error",
                                "/api/**" // <-- Permite acceso libre a controladores y datos de la BD
                        ).permitAll()
                        .anyRequest().permitAll())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"Se requiere un JWT válido\"}");
                        }))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Busca al usuario en la base de datos MySQL por su correo
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        // Admin 1
        UserDetails admin1 = User.builder()
                .username("soporte_toro_forrajero@outlook.com")
                .password(passwordEncoder.encode("Admin1234*"))
                .roles("ADMIN")
                .build();

        // Admin 2 / Soporte
        UserDetails admin2 = User.builder()
                .username("soporte_toro_forrajero@pro.com")
                .password(passwordEncoder.encode("AdminPass123!"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(admin1, admin2);
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