// ==========================================
// VALIDACIÓN DEL CORREO ELECTRÓNICO
// ==========================================

const correoLogin = document.querySelector("#correoLogin");
const alertaCorreoLogin = document.querySelector("#alertaCorreoLogin");

function validarCorreo() {

    const correo = correoLogin.value.trim();

    // Expresión regular para validar correo
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Campo vacío
    if (correo === "") {

        alertaCorreoLogin.innerHTML =
            '<span class="alerta-titulo">Correo Electrónico No válido:</span> Debes llenar el campo';

        alertaCorreoLogin.classList.remove("d-none");

        return false;
    }

    // Correo con formato incorrecto
    if (!formatoCorreo.test(correo)) {

        alertaCorreoLogin.innerHTML =
            '<span class="alerta-titulo">Correo Electrónico No válido:</span> Ingresa un correo válido';

        alertaCorreoLogin.classList.remove("d-none");

        return false;
    }

    // Correo correcto
    alertaCorreoLogin.classList.add("d-none");

    return true;
}

const btnIniciarSesion = document.querySelector("#btnIniciarSesion");

btnIniciarSesion.addEventListener("click", function () {

    const correoValido = validarCorreo();
    const passwordValido = validarPassword();

    if (!correoValido || !passwordValido) {
        return;
    }

});


// ==========================================
//        VALIDACIÓN DE CONTRASEÑA
// ==========================================

const password = document.querySelector("#password"); //Selecciona la entrada de contraseña con el id = password y lo guerda en la constante password.
const errorPassword = document.querySelector("#errorPassword"); // Selecciona el div con id="errorPassword" y lo guarda en la constante password.

function validarPassword() { //creamos nuestra funcion para validar la contraseña que ingrese el usuario cada que le da click al botón de iniciar sesión.
    password.classList.remove("campo-error", "campo-correcto"); //para limpiar los campos de error y correcto.
    errorPassword.classList.add("d-none"); //oculta el mensaje de error cuando se había ejeuctado de un intento anteior.

    if (password.value.trim().length < 8) { // revisamos que la entrada sea de almenos 8 caracteres.
        errorPassword.classList.remove("d-none"); // Si no cumple la condición, entonces muestra el mensaje de error
        password.classList.add("campo-error"); // marca visualmente el campo como incorrecto
        return false;
    } else {
        password.classList.add("campo-correcto"); // marca visualmente el campo como correcto
        return true;
    }
}

// ==========================================
// OBTENER USUARIOS
// ==========================================

const API_URL = 'http://44.202.55.123:8080/api/usuarios';

async function obtenerUsuarios() {
    const usuariosLocalStorage =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuariosLocalStorage.length > 0) {
        console.log(
            "Usuarios obtenidos desde LocalStorage:",
            usuariosLocalStorage
        );
        return usuariosLocalStorage;
    }

    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const usuariosJSON = await respuesta.json();
        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuariosJSON)
        );
        console.log(
            "Usuarios obtenidos desde JSON Server:",
            usuariosJSON
        );
        return usuariosJSON;
    } catch (error) {
        console.error(
            "No se pudieron obtener los usuarios:",
            error
        );
        return [];
    }
}

// ==========================================
// AUTENTICACIÓN
// ==========================================

// ==========================================
// AUTENTICACIÓN (Conectado con Spring Boot y BCrypt)
// ==========================================

async function autenticarUsuario(correo, contrasena) {
    try {
        const respuesta = await fetch("http://44.202.55.123:8080/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // Mandamos los datos con los nombres exactos que espera tu UsuarioRequest
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        // Si el backend responde con error (401 Unauthorized), las credenciales fallaron
        if (!respuesta.ok) {
            return null;
        }

        // Si es exitoso, nos regresa el objeto UsuarioResponse con el rol y los datos limpios
        const usuarioResponse = await respuesta.json();
        return usuarioResponse;

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        return null;
    }
}
// ==========================================
// MANEJADOR DE EVENTO PARA INICIAR SESIÓN
// ==========================================
btnIniciarSesion.addEventListener("click", async function (e) {
    e.preventDefault(); // Evita recargar si el botón está dentro de un <form>

    // Validar el formato del correo
    const correoEsValido = validarCorreo();
    if (!correoEsValido) return;

    const correo = correoLogin.value.trim();
    const contraseña = password ? password.value.trim() : "";

    if (contraseña === "") {
        alertaCorreoLogin.innerHTML =
            '<span class="alerta-titulo">Contraseña requerida:</span> Ingresa tu contraseña';
        alertaCorreoLogin.classList.remove("d-none");
        return;
    }

    // Proceso de autenticación
    const usuarioAutenticado = await autenticarUsuario(correo, contraseña);

    if (!usuarioAutenticado) {
        alertaCorreoLogin.innerHTML =
            '<span class="alerta-titulo">Error de acceso:</span> Correo o contraseña incorrectos';
        alertaCorreoLogin.classList.remove("d-none");
        return;
    }

    // Login exitoso: Guardar la sesión activa
    localStorage.setItem("usuarioActivo", JSON.stringify(usuarioAutenticado));

    // Redireccionar a productos
    console.log(JSON.stringify(usuarioAutenticado));
    window.location = usuarioAutenticado.rol === "admin" ? "adminHome.html";
});