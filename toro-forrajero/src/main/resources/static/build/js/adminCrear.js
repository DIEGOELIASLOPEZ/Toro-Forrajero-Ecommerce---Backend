/*******************************************************************************
 * PÁGINA: Admin Crear producto (build/js/adminCrear.js)
 ******************************************************************************/

// Objeto que acumulará los datos antes de enviar
const mensajeValidado = {
    mNombreProducto: "",
    mEspecie: "",
    mMarca: "",
    mCosto: "",
    mPrecio: "",
    mExistencia: "",
    mDescripcion: "",
    mDestacado: "inactivo",
    mEstado: "inactivo",
    mImagen: ""
};

function reiniciarMensajeValidado() {
    mensajeValidado.mNombreProducto = "";
    mensajeValidado.mEspecie = "";
    mensajeValidado.mMarca = "";
    mensajeValidado.mCosto = "";
    mensajeValidado.mPrecio = "";
    mensajeValidado.mExistencia = "";
    mensajeValidado.mDescripcion = "";
    mensajeValidado.mDestacado = "inactivo";
    mensajeValidado.mEstado = "inactivo";
    mensajeValidado.mImagen = "";
}

//=============================================================================
//                       AUTENTICACIÓN Y ROL
//=============================================================================

function esAdmin() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioActivo')) || null;
    return usuarioSesion && usuarioSesion.rol === 'admin';
}

function verificarAccesoAdmin() {
    if (!esAdmin()) {
        mostrarModalAccesoDenegado("Acceso denegado: No tienes permisos para acceder a esta página.");
        return false;
    }
    return true;
}

function mostrarModalAccesoDenegado(mensaje) {
    const modal = document.createElement('DIV');
    modal.classList.add('modal-fullscreen-overlay');

    const contenidoModal = document.createElement('DIV');
    contenidoModal.classList.add('contenido-modal-denegado');

    contenidoModal.innerHTML = `
        <h3 class="text-center titulo-denegado">${mensaje}</h3>
        <div class="d-flex admin-btns justify-content-center mt-4">
            <button type="button" class="btn-cancelar">Entendido</button>
        </div>
    `;

    modal.appendChild(contenidoModal);

    const redirigir = () => {
        cerrarModalGenerico('.modal-fullscreen-overlay');
        window.location.href = "index.html";
    };

    modal.addEventListener('click', function (evento) {
        if (evento.target === modal) redirigir();
    });

    const btnEntendido = contenidoModal.querySelector('.btn-cancelar');
    btnEntendido?.addEventListener('click', redirigir);

    document.body.classList.add('overflow-hidden');
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('is-visible');
    }, 10);
}

//=============================================================================
//                              VALIDACIONES
//=============================================================================

function validarNombreProducto(inputNombreProducto) {
    if (!inputNombreProducto) return "No se encontró el campo Nombre Producto";
    const nombreProducto = inputNombreProducto.value.trim();
    const alertMensaje = `<span class="alerta-titulo">El nombre del producto </span>`;
    if (nombreProducto === "") return alertMensaje + `<span class="alerta-titulo">no puede estar vacío. </span>`;
    if (nombreProducto.length < 3) return alertMensaje + `<span class="alerta-titulo">debe tener más de 3 caracteres. </span>`;
    return undefined;
}

function validarEspecie(selectEspecie) {
    if (!selectEspecie) return "No se encontró el selector de especie.";
    if (selectEspecie.value === "") return `<span class="alerta-titulo">Debe seleccionar una especie.</span>`;
    return undefined;
}

function validarMarca(selectMarca) {
    if (!selectMarca) return "No se encontró el campo Marca";
    const marca = selectMarca.value.trim();
    if (marca === "") {
        return `<span class="alerta-titulo narnaja-text">La marca debe ser seleccionada.</span>`;
    }
    return undefined;
}

function validarCosto(eCosto) {
    if (!eCosto) return "No se encontró el campo Costo";
    const costo = eCosto.value.trim();
    const alertMensaje = `<span class="alerta-titulo narnaja-text">El costo </span>`;

    if (costo === "") return `${alertMensaje}<span class="narnaja-text">no puede estar vacío.</span>`;
    if (isNaN(Number(costo))) return `${alertMensaje}<span class="narnaja-text">debe ser un número válido.</span>`;
    if (Number(costo) <= 0) return `${alertMensaje}<span class="narnaja-text">debe ser mayor a $0.00.</span>`;

    return undefined;
}

function validarPrecioVenta(ePrecioVenta) {
    if (!ePrecioVenta) return "No se encontró el campo Precio de Venta";
    const precioVenta = ePrecioVenta.value.trim();
    const alertMensaje = `<span class="alerta-titulo narnaja-text">El precio de venta </span>`;

    if (precioVenta === "") return `${alertMensaje} <span class="narnaja-text">no puede estar vacío.</span>`;
    if (Number(precioVenta) <= 0) return `${alertMensaje} <span class="narnaja-text">debe ser mayor a $0.00.</span>`;
    return undefined;
}

function validarExistencia(eExistencia) {
    if (!eExistencia) return "No se encontró el campo Existencia";
    const existencia = eExistencia.value.trim();
    const alertMensaje = `<span class="alerta-titulo narnaja-text">La existencia </span>`;

    if (existencia === "") return `${alertMensaje} <span class="narnaja-text">no puede estar vacía.</span>`;
    if (Number(existencia) < 0) return `${alertMensaje} <span class="narnaja-text">no puede ser menor que 0.</span>`;
    if (!Number.isInteger(Number(existencia))) return `${alertMensaje} <span class="narnaja-text">debe ser un número entero.</span>`;
    return undefined;
}

/* -----------------------------------------------------------------------------
   INTERACTIVIDAD DE LOS TOGGLES (CAMBIO DE TEXTO VISUAL)
----------------------------------------------------------------------------- */
function visibilidadProducto() {
    const checkVisibilidad = document.querySelector('.toggle-switch input[type="checkbox"]');
    const mensajeVisibilidad = document.querySelector('.estado-texto');

    if (!checkVisibilidad || !mensajeVisibilidad) return;
    checkVisibilidad.addEventListener('change', function (e) {
        if (e.target.checked) {
            mensajeVisibilidad.textContent = "activo";
            mensajeValidado.mEstado = "activo";
        } else {
            mensajeVisibilidad.textContent = "inactivo";
            mensajeValidado.mEstado = "inactivo";
        }
    });
}

// IMAGEN
function validarImagen(inputImagen) {
    if (!inputImagen) return "No se encuentra el campo de la imagen";

    const archivos = inputImagen.files;
    const alertMensaje = `<span class="alerta-titulo narnaja-text">Imagen principal:</span>`;

    if (!archivos || archivos.length === 0) {
        return `${alertMensaje} <span class="narnaja-text">Debes seleccionar una imagen.</span>`;
    }

    const archivo = archivos[0];
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxTamanoBytes = 50 * 1024 * 1024; // 50MB

    if (!tiposPermitidos.includes(archivo.type.toLowerCase())) {
        return `${alertMensaje} <span class="narnaja-text">Formato no válido. Solo JPG, PNG y WEBP.</span>`;
    }

    if (archivo.size > maxTamanoBytes) {
        return `${alertMensaje} <span class="narnaja-text">El archivo supera el tamaño máximo permitido (50MB).</span>`;
    }

    return undefined;
}

function validarMensaje(inputMensaje) {
    if (!inputMensaje) return "No se encontró la caja de comentarios.";
    const texto = inputMensaje.value.trim();

    if (texto.length === 0) {
        return `<span class="alerta-titulo narnaja-text">La descripción no puede estar vacía.</span>`;
    }
    if (texto.length > 300) {
        return `<span class="alerta-titulo narnaja-text">Has excedido el límite de 300 caracteres.</span>`;
    }
    return undefined;
}

//=============================================================================
//                              UTILIDADES Y HELPERS
//=============================================================================

function restringirSoloNumeros(inputElement) {
    if (!inputElement) return;

    inputElement.addEventListener('keydown', function (e) {
        const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];

        if (teclasPermitidas.includes(e.key) || e.ctrlKey || e.metaKey) {
            return;
        }

        if (e.key === '.') {
            if (e.target.value.includes('.')) {
                e.preventDefault();
            }
            return;
        }

        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    });
}

function obtenerBase64(imagen) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imagen);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function actualizarContador() {
    const comentario = document.getElementById("descripcion-producto");
    const contador = document.getElementById("contador");
    const longitudMaxima = 300;

    if (!comentario || !contador) return;

    let texto = comentario.value;
    let textoSinEspacios = texto.trim();
    let longitud = texto.length;
    let numeroPalabras = textoSinEspacios.length > 0 ? textoSinEspacios.split(/\s+/).length : 0;

    let mensaje = `${longitud} de ${longitudMaxima} caracteres | ${numeroPalabras} palabras`;

    if (longitud > 0 && textoSinEspacios.length === 0) {
        mensaje = "¡El texto no puede contener solo espacios en blanco!";
    } else if (longitud > longitudMaxima) {
        mensaje = `¡Has excedido el límite! (${longitud} / ${longitudMaxima})`;
    }

    contador.textContent = mensaje;
    contador.style.color = (longitud > longitudMaxima || (longitud > 0 && textoSinEspacios.length === 0)) ? "red" : "black";
}

function visibilidadProducto() {
    const checkVisibilidad = document.querySelector('.toggle-switch input[type="checkbox"]');
    const mensajeVisibilidad = document.querySelector('.estado-texto');

    if (!checkVisibilidad || !mensajeVisibilidad) return;
    checkVisibilidad.addEventListener('change', function (e) {
        mensajeVisibilidad.textContent = e.target.checked ? "activo" : "inactivo";
    });
}

function productoDestacado() {
    const checkDestacado = document.getElementById('check-destacado');
    const mensajeDestacado = document.getElementById('texto-destacado');
    if (!checkDestacado || !mensajeDestacado) return;

    checkDestacado.addEventListener('change', function (e) {
        mensajeDestacado.textContent = e.target.checked ? "SÍ" : "NO";
    });
}

function mostrarError(selector, mensajeError) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.innerHTML = mensajeError || "";
    }
}

//=============================================================================
//                      INICIALIZACIÓN Y EVENTOS DOM
//=============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Verificación estricta de permisos al cargar
    if (!verificarAccesoAdmin()) return;

    // 1. Restricciones de teclado para inputs numéricos
    restringirSoloNumeros(document.getElementById("costo"));
    restringirSoloNumeros(document.getElementById("precioVenta"));
    restringirSoloNumeros(document.getElementById("existencia"));

    // 2. Interfaz visual (Toggles y Contador)
    visibilidadProducto();
    productoDestacado();

    const formulario = document.querySelector("#formulario-adminCrear");
    const campoDescripcion = document.getElementById("descripcion-producto");

    if (campoDescripcion) {
        campoDescripcion.addEventListener("input", actualizarContador);
        actualizarContador();
    }

    // 3. Envío de Formulario
    if (formulario) {
        formulario.addEventListener('submit', async function (e) {
            e.preventDefault();
            reiniciarMensajeValidado();

            // Referencias del DOM
            const inputNombreProducto = document.getElementById("nombre-producto");
            const selectEspecie = document.getElementById("especie");
            const selectMarca = document.getElementById("marca");
            const eCosto = document.getElementById("costo");
            const ePrecioVenta = document.getElementById("precioVenta");
            const eExistencia = document.getElementById("existencia");
            const divAlerta = document.querySelector(".alerta");
            const inputImagen = document.getElementById("imagen-principal");
            const inputDescripcion = document.getElementById("descripcion-producto");

            const checkVisibilidad = document.querySelector('.toggle-switch input[type="checkbox"]');
            const checkDestacado = document.getElementById('check-destacado');

            // Ejecutar validaciones
            const errorNombre = validarNombreProducto(inputNombreProducto);
            const errorEspecie = validarEspecie(selectEspecie);
            const errorMarca = validarMarca(selectMarca);
            const errorCosto = validarCosto(eCosto);
            const errorPrecioVenta = validarPrecioVenta(ePrecioVenta);
            const errorExistencia = validarExistencia(eExistencia);
            const errorImagen = validarImagen(inputImagen);
            const errorDescripcion = validarMensaje(inputDescripcion);

            // Renderizar errores
            mostrarError("#error-nombre p", errorNombre);
            mostrarError("#error-especie p", errorEspecie);
            mostrarError("#error-marca p", errorMarca);
            mostrarError("#error-costo p", errorCosto);
            mostrarError("#error-venta p", errorPrecioVenta);
            mostrarError("#error-existencia p", errorExistencia);
            mostrarError("#error-imagen", errorImagen);
            mostrarError("#error-mensaje p", errorDescripcion);

            const hayErrores = errorNombre || errorEspecie || errorMarca || errorCosto || 
                               errorPrecioVenta || errorExistencia || errorImagen || errorDescripcion;

            if (hayErrores) {
                if (divAlerta) {
                    divAlerta.innerHTML = `
                    <div class="alert bg-naranjaFuerte alert-dismissible fade show" role="alert">
                        <span class="alerta-titulo">Parece que hay un detalle:</span> Revisa los campos resaltados para poder continuar.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                }
                return;
            }

            // Mapeo de datos validados
            mensajeValidado.mNombreProducto = inputNombreProducto.value.trim();
            mensajeValidado.mEspecie = selectEspecie.options[selectEspecie.selectedIndex].text;
            mensajeValidado.mMarca = selectMarca.options[selectMarca.selectedIndex].text;
            mensajeValidado.mCosto = eCosto.value.trim();
            mensajeValidado.mPrecio = ePrecioVenta.value.trim();
            mensajeValidado.mExistencia = eExistencia.value.trim();
            mensajeValidado.mDescripcion = inputDescripcion.value.trim();
            mensajeValidado.mEstado = (checkVisibilidad && checkVisibilidad.checked) ? "activo" : "inactivo";
            mensajeValidado.mDestacado = (checkDestacado && checkDestacado.checked) ? "activo" : "inactivo";

            // Procesar Imagen a Base64
            const archivoImagen = inputImagen.files[0];
            if (archivoImagen) {
                try {
                    mensajeValidado.mImagen = await obtenerBase64(archivoImagen);
                } catch (error) {
                    console.error("Error al procesar la imagen:", error);
                    mensajeValidado.mImagen = "recursos-graficos/productos/placeholder.png";
                }
            } else {
                mensajeValidado.mImagen = "recursos-graficos/productos/placeholder.png";
            }

            // Guardar registro
            await enviarDatos();
        });
    }
});

//=============================================================================
//                      PETICIÓN POST / JSON-SERVER
//=============================================================================

const API_URL = 'http://44.202.55.123:8080/api/productos';

async function enviarDatos() {
    mostrarModalLoader();
    try {
        // Objeto que coincide exactamente con ProductosRequestDTO
        const dto = {
            nombre: mensajeValidado.mNombreProducto, // Debe coincidir con el campo de ProductosRequestDTO
            descripcion: mensajeValidado.mDescripcion || "",
            destacado: mensajeValidado.mDestacado === "activo",
            especie: mensajeValidado.mEspecie,
            costo: parseFloat(mensajeValidado.mCosto) || 0,
            precioVenta: parseFloat(mensajeValidado.mPrecio) || 0,
            marca: mensajeValidado.mMarca,
            imagen: mensajeValidado.mImagen || "",
            stock: parseInt(mensajeValidado.mExistencia, 10) || 0,
            visibilidad: mensajeValidado.mEstado === "activo"
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dto)
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const productoCreado = await response.json();

        cerrarModalGenerico('.modal-overlay');

        // Redirige añadiendo la marca de tiempo para forzar que el navegador refresque los datos
        window.location.href = `adminHome.html?t=${new Date().getTime()}`;

    } catch (error) {
        console.error('Error al guardar:', error);
        alert("Hubo un error al guardar el producto.");
        cerrarModalGenerico('.modal-overlay');
    }
}

//=============================================================================
//                               MODALES
//=============================================================================

function mostrarModalLoader() {
    const modal = document.createElement('DIV');
    const carga = document.createElement('DIV');
    carga.innerHTML = `
        <div class="contenedor-loader">
            <img class="animacion-carga" src="recursos-graficos/formulario-contactanos/Forrajero-naranja.png" alt="Cargando">
        </div>`;
    modal.classList.add('modal-overlay');

    document.body.classList.add('overflow-hidden');
    document.body.appendChild(modal);
    modal.appendChild(carga);

    setTimeout(() => {
        modal.classList.add('is-visible');
    }, 10);
}

function cerrarModalGenerico(selectorModal) {
    const modal = document.querySelector(selectorModal);

    if (modal) {
        modal.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden');

        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}