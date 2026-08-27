/*******************************************************************************
 *
 * PÁGINA: CONTÁCTANOS
 *
 ******************************************************************************/

// Objeto que acumulará los datos si todo sale bien
let mensajeValidado = {
    mNombre: "",
    mTelefono: "",
    mCorreo: "",
    mHorario: "", // Pendiente
    mFecha: "",   // Pendiente 
    mMotivo: "",
    mMensaje: ""
};

function reiniciarMensajeValidado() {
    for (let key in mensajeValidado) {
        mensajeValidado[key] = "";
    }
}

/* -----------------------------------------------------------------------------
    FUNCIONES DE VALIDACIÓN INDIVIDUALES
    (Retornan un string con el error, o undefined si todo está correcto)
----------------------------------------------------------------------------- */

// Óscar - Nombre
function validarNombre(inputNombre) {
    if (!inputNombre) return "No se encontró el campo nombre";
    const nombre = inputNombre.value.trim();
    const alertMensaje = `<span class="alerta-titulo">El Nombre </span>`;

    if (nombre === "") return alertMensaje + " no puede estar vacío.";
    if (/\d/.test(nombre)) return alertMensaje + " no puede contener números.";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre)) return alertMensaje + " solo puede contener letras y espacios.";
    if (nombre.length < 3) return alertMensaje + " debe tener al menos 3 caracteres.";
    
    return undefined;
}

// Karen - Teléfono
function validarTelefono(inputTelefono) {
    if (!inputTelefono) return "Campo teléfono no encontrado";
    const telefono = inputTelefono.value.replace(/[\s-]/g, ""); 
    const alertMensaje = `<span class="alerta-titulo">Teléfono No válido:</span>`;

    if (telefono === "") return `${alertMensaje} Debes llenar el campo`;
    if (!/^\d{10}$/.test(telefono)) return `${alertMensaje} El teléfono debe tener exactamente 10 dígitos`;

    return undefined;
}

// Elias - Correo Electrónico (Actualizado con Regex)
function validarCorreo(inputCorreo) {
    if (!inputCorreo) return "Campo correo no encontrado";
    const correo = inputCorreo.value.trim();
    const alertMensaje = `<span class="alerta-titulo">Correo Electrónico No válido:</span>`;

    if (correo === "") return `${alertMensaje} Debes llenar el campo`;
    
    // Expresión regular universal para correos (permite cualquier dominio válido)
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexCorreo.test(correo)) return `${alertMensaje} El formato del correo es incorrecto`;

    // Evitar usuarios muy genéricos (opcional, pero mantenido de tu lógica)
    const nombreCorreo = correo.split("@")[0].toLowerCase();
    const usuariosGenericos = ["test", "prueba", "admin", "null", "undefined"];
    if (usuariosGenericos.includes(nombreCorreo)) return `${alertMensaje} No uses correos de prueba`;

    return undefined;
}

// Motivo
function validarMotivo(selectMotivo) {
    if (!selectMotivo) return "No se encontró el selector de motivo.";
    if (selectMotivo.value === "") return `<span class="alerta-titulo">Motivo de contacto:</span> Debes seleccionar un motivo.`;
    return undefined;
}

// Natalia - Mensaje
function validarMensaje(inputMensaje) {
    if (!inputMensaje) return "No se encontró la caja de comentarios.";
    const texto = inputMensaje.value.trim();
    
    if (texto.length === 0) return `<span class="alerta-titulo class narnaja-text">Revisa que no exceda 300 caracteres ni sean solo espacios.</span>`;
    if (texto.length > 300) return "Has excedido el límite de 300 caracteres.";
    
    return undefined;
}

/* -----------------------------------------------------------------------------
    LÓGICA DEL CONTADOR EN VIVO (Natalia)
----------------------------------------------------------------------------- */
const COMENTARIO = document.getElementById("caja_de_comentarios");
const CONTADOR = document.getElementById("contador");
const longitud_maxima = 300; 

function actualizarContador() {
    if (!COMENTARIO || !CONTADOR) return;
    
    let texto = COMENTARIO.value;
    let texto_sin_espacios = texto.trim();
    let longitud = texto.length;
    let numero_de_palabras = texto_sin_espacios.length > 0 ? texto_sin_espacios.split(/\s+/).length : 0;

    let mensaje = `${longitud} de ${longitud_maxima} caracteres | ${numero_de_palabras} palabras`;

    if (longitud > 0 && texto_sin_espacios.length === 0) {
        mensaje = "¡El texto no puede contener solo espacios en blanco!";
    } else if (longitud > longitud_maxima) {
        mensaje = `¡Has excedido el límite! (${longitud} / ${longitud_maxima})`;
    }

    CONTADOR.textContent = mensaje;
    CONTADOR.style.color = (longitud > longitud_maxima || (longitud > 0 && texto_sin_espacios.length === 0)) ? "red" : "black";
}

if (COMENTARIO) {
    COMENTARIO.addEventListener("input", actualizarContador);


}

// NUEVO E IMPORTANTE: Variable de estado para saber si el usuario tocó el horario
// Ayuando a Vane para mantener los numeros en los horarios Diseño UX 
// Enfocado en la usabilidad y experiencia del usuario by El Deivid

let horarioFueInteractuado = false;

// Seleccionamos los inputs fuera del submit para poder escuchar sus eventos
const inputGlobalInicio = document.getElementById("hora-inicio");
const inputGlobalFin = document.getElementById("hora-fin");

if (inputGlobalInicio && inputGlobalFin) {
    // Si el usuario cambia algo en estos inputs, marcamos el estado como 'true'
    inputGlobalInicio.addEventListener("change", () => horarioFueInteractuado = true);
    inputGlobalFin.addEventListener("change", () => horarioFueInteractuado = true);
}

// Vane - Horario 
// Se actualizo la funcion by el Deivid 
function validarHorario(inputInicio, inputFin, fueInteractuado) { // <-- ¡Agregamos el parámetro aquí!
    if (!inputInicio || !inputFin) return "No se encontró el campo de horario.";

    // Definimos alertMensaje UNA SOLA VEZ
    const alertMensaje = `<span class="alerta-titulo narnaja-text">Horario:</span>`;

    // 1. NUEVA VALIDACIÓN: Si no lo han tocado, lanzamos el error aunque tengan valor
    if (!fueInteractuado) return `${alertMensaje} <span class="narnaja-text">Debes confirmar o seleccionar un horario.</span>`;

    const horaInicio = inputInicio.value; 
    const horaFin = inputFin.value;
    const HORA_MIN = "08:00";
    const HORA_MAX = "20:00";
    
    if (!horaInicio || !horaFin) 
        return `${alertMensaje} <span class="narnaja-text">Debes llenar el campo</span>`;

    if (horaFin <= horaInicio) 
        return `${alertMensaje} <span class="narnaja-text">Pusiste ${horaFin} como hora final, pero debe ser más tarde que ${horaInicio}</span>`;

    if (horaInicio < HORA_MIN || horaInicio > HORA_MAX || horaFin < HORA_MIN || horaFin > HORA_MAX) {
        return `${alertMensaje} <span class="narnaja-text">Debes seleccionar un horario entre 8:00 a.m. y 8:00 p.m.</span>`;
    }

    return undefined;
}

// David - Fecha de contacto
function validarFecha(inputFecha) {
    if (!inputFecha) return "No se encontró el campo de fecha.";
    const fechaSeleccionada = inputFecha.value.trim();
    const alertMensaje = `<span class="alerta-titulo">Fecha de contacto:</span>`;

    // 1. Validar que no esté vacío
    if (fechaSeleccionada === "") return `${alertMensaje} Debes seleccionar una fecha.`;

    // 2. Validar que no sea una fecha pasada
    // Asumiendo que tu input es type="date", el valor llega como "YYYY-MM-DD"
    // Separamos los valores para instanciar la fecha de forma segura y evitar problemas de zona horaria
    const [year, month, day] = fechaSeleccionada.split('-');
    const fechaIngresada = new Date(year, month - 1, day); 
    
    // Obtenemos la fecha de hoy y le ponemos la hora a 00:00:00 para comparar solo el día
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaIngresada < hoy) {
        return `${alertMensaje} Por favor, elige una fecha a partir de hoy.`;
    }

    return undefined;
}


/* -----------------------------------------------------------------------------
    VALIDACIÓN MAESTRA Y ENVÍO DEL FORMULARIO
----------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Se recomienda ponerle un ID al formulario en tu HTML, ej: id="formulario-contacto"
    const formulario = document.querySelector("#formulario-contacto") || document.querySelector("form");
    
    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault(); // Evita que la página se recargue
            
            reiniciarMensajeValidado();

            // Referencias a los inputs
            const inputNombre = document.getElementById("nombre");
            const inputTelefono = document.getElementById("telefono");
            const inputCorreo = document.getElementById("correo");
            const selectMotivo = document.getElementById("motivo");
            const divAlerta = document.querySelector(".alerta");
            const inputHoraInicio = document.getElementById("hora-inicio");
            const inputHoraFin = document.getElementById("hora-fin");
            const inputFecha = document.getElementById("fecha"); // Aqui validamos la Fecha by el Deivid ;) 
            
            // Ejecutar validaciones
            const errorNombre = validarNombre(inputNombre);
            const errorTelefono = validarTelefono(inputTelefono);
            const errorCorreo = validarCorreo(inputCorreo);
            const errorMotivo = validarMotivo(selectMotivo);
            const errorMensaje = validarMensaje(COMENTARIO);
            const errorHorario = validarHorario(inputHoraInicio, inputHoraFin, horarioFueInteractuado); // Pasamos la variable de estado 'horarioFueInteractuado' como tercer argumento
            const errorFecha = validarFecha(inputFecha); // Se valida la fecha by el Deivid

            // Mostrar u ocultar errores en el DOM
            mostrarError("#error-nombre p", errorNombre);
            mostrarError("#error-telefono p", errorTelefono);
            mostrarError("#error-correo p", errorCorreo);
            mostrarError("#error-motivo p", errorMotivo);
            mostrarError("#error-mensaje p", errorMensaje); 
            mostrarError("#error-hora p", errorHorario);
            mostrarError("#error-fecha p", errorFecha);
            const hayErrores = errorNombre || errorTelefono || errorCorreo || errorMotivo || errorMensaje || errorHorario || errorFecha;

            if (hayErrores) {
                if (divAlerta) {
                    divAlerta.innerHTML = `
                    <div class="alert bg-naranjaFuerte alert-dismissible fade show" role="alert">
                        <span class="alerta-titulo">Parece que hay un detalle:</span> Revisa los campos resaltados para poder continuar.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                }
                console.warn("Envío bloqueado por errores.");
                return;
            }

            // Si pasa todas las validaciones, construimos el objeto
            mensajeValidado.mNombre = inputNombre.value.trim();
            mensajeValidado.mTelefono = inputTelefono.value.replace(/[\s-]/g, "");
            mensajeValidado.mCorreo = inputCorreo.value.trim();
            mensajeValidado.mMotivo = selectMotivo.options[selectMotivo.selectedIndex].text;
            mensajeValidado.mMensaje = COMENTARIO.value.trim();
            mensajeValidado.mHorario = `${inputHoraInicio.value} - ${inputHoraFin.value}`;
            mensajeValidado.mFecha = inputFecha.value.trim();

            if (divAlerta) {
                divAlerta.innerHTML = `
                <div class="alert bg-success text-white alert-dismissible fade show" role="alert">
                    Formulario enviado <span class="alerta-titulo">Correctamente</span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
            }

            console.log("¡ÉXITO TOTAL! Objeto listo:", mensajeValidado);

            console.log(mensajeValidado); //vemos que sí esté el mensaje completo

            /* -----------------------------------------------------------------------------
            Usamos EmailJS para enviar la información recopilada en el formulario al mail
            ----------------------------------------------------------------------------- */
            emailjs.init("3KkLupFj0lLfxdHq2"); //Public API Key del EmailJS
            
            emailjs.send(
            "service_i8a49io", //Service Id de EmailJS
            "template_7a53bep", //Template del email que creamos en EmailJS 'Contact US'
            {
                nombre: mensajeValidado.mNombre,
                telefono: mensajeValidado.mTelefono,
                correo: mensajeValidado.mCorreo,
                asunto: `[${mensajeValidado.mMotivo}] Nuevo mensaje de contacto`,
                mensaje: mensajeValidado.mMensaje,
                horario: mensajeValidado.mHorario, 
                fecha: mensajeValidado.mFecha
            }
            )
            .then((response) => {
                console.log("Email enviado exitosamente: ", response)
            formulario.reset();
            actualizarContador();
            })
            .catch(error => {
            console.error("Error de EmailJS: ", error);
            });
        });
    }
});

// Función auxiliar para inyectar los errores en el HTML
function mostrarError(selector, mensajeError) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.innerHTML = mensajeError || "";
    }
}