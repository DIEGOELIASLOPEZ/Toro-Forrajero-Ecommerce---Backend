package org.toro_forrajero.dto;

import lombok.Data;

public class UsuarioDTO {

    // REQUEST: Datos necesarios para crear o actualizar un usuario
    @Data
    public static class UsuarioRequest {
        private String nombre;
        private String apellido;
        private String telefono;
        private String areaInteres;
        private String correo;
        private String estado;
        private String contrasena;
        private String rol;
    }

    // RESPONSE: Salida de datos hacia el cliente/frontend
    @Data
    public static class UsuarioResponse{
        private Long idUsuario;
        private String nombre;
        private String apellido;
        private String telefono;
        private String areaInteres;
        private String correo;
        private String estado;
        private String rol;
    }
}
