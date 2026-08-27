package org.toro_forrajero.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

// Importaciones únicas y limpias de tu proyecto
import org.toro_forrajero.dto.AuthResponse;
import org.toro_forrajero.dto.LoginRequest;
import org.toro_forrajero.security.JWTService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AuthController(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        UserDetails userDetails;

        try {
            // Busca el usuario usando getUser()
            userDetails = userDetailsService.loadUserByUsername(loginRequest.getUser());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales Incorrectas");
        }

// Valida la contraseña usando getPassword()
        if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales Incorrectas");
        }

        String token = jwtService.generateToken(userDetails);
        return new AuthResponse(token, "Bearer", jwtService.getExpirationTimeMs());
    }
}