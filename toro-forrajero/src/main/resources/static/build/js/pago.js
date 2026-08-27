console.log("===== PAGO.JS CARGADO CORRECTAMENTE =====");

// ==========================================
// VERIFICACIÓN DE SESIÓN EN PAGO / CHECKOUT
// ==========================================
/*
* Muestra lo de detalle_Carrito
*/

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
                       || JSON.parse(sessionStorage.getItem('usuarioActivo'));

    if (!usuarioActivo) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Obtener el carrito del usuario
        const respuestaCarrito = await fetch(`http://44.202.55.123:8080/api/carrito/usuario/${usuarioActivo.id}`);
        if (!respuestaCarrito.ok) throw new Error("No se pudo obtener el carrito del usuario");

        const carritoData = await respuestaCarrito.json();
        console.log("Datos del carrito recibidos:", carritoData);

        const carritoObj = Array.isArray(carritoData) ? carritoData[0] : carritoData;
        const idCarrito = carritoObj ? carritoObj.id : null;

        if (!idCarrito) {
            mostrarResumenPedidoBackend([]);
            return;
        }

        // Consultar los detalles del carrito
        const respuestaDetalles = await fetch(`http://44.202.55.123:8080/api/detalle-carrito/${idCarrito}/detalles`);
        if (!respuestaDetalles.ok) throw new Error("No se pudieron obtener los detalles del carrito");

        const itemsDetalle = await respuestaDetalles.json();
        console.log("Productos detallados:", itemsDetalle);

        mostrarResumenPedidoBackend(itemsDetalle);

    } catch (error) {
        console.error("Error al cargar el carrito:", error);
        mostrarResumenPedidoBackend([]);
    }
});

function mostrarResumenPedidoBackend(carrito) {
    const detallePedido = document.getElementById('detalle-pedido');
    const totalPedido = document.getElementById('total-pedido');

    if (!detallePedido || !totalPedido) return;

    if (!carrito || carrito.length === 0) {
        detallePedido.innerHTML = `<p class="mb-0 small">No hay productos en el carrito.</p>`;
        totalPedido.textContent = '$0.00 MXN';
        return;
    }

    let total = 0;
    let htmlContenido = '';

    carrito.forEach(item => {
        const nombre = item.nombreProducto || 'Producto';
        const precio = Number(item.precioUnitario) || 0;
        const cantidad = item.cantidad || 1;

        const subtotal = item.subtotal ? Number(item.subtotal) : (precio * cantidad);
        total += subtotal;

        htmlContenido += `
            <div class="d-flex justify-content-between mb-2">
                <span>${nombre} (x${cantidad})</span>
                <span>$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
            </div>
        `;
    });

    detallePedido.innerHTML = htmlContenido;
    totalPedido.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
}

// ==========================================
// TOGGLE MÉTODO DE ENTREGA Y ESTADO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const selectEstado = document.getElementById('estado');
    const inputCiudad = document.getElementById('ciudad');

    if (selectEstado && inputCiudad) {
        selectEstado.addEventListener('change', () => {
            const textoSeleccionado = selectEstado.options[selectEstado.selectedIndex].text;
            inputCiudad.value = textoSeleccionado;
        });
    }

    const bloqueDireccion = document.getElementById('bloque-direccion');
    const bloqueRetiroTienda = document.getElementById('bloque-retiro-tienda');

    document.querySelectorAll('.delivery-method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.delivery-method-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const esTienda = btn.dataset.metodo === 'tienda';
            if (bloqueDireccion) bloqueDireccion.style.display = esTienda ? 'none' : 'block';
            if (bloqueRetiroTienda) bloqueRetiroTienda.style.display = esTienda ? 'block' : 'none';
        });
    });
});

// ==========================================
// VALIDACIONES DIRECCIÓN (CHECKOUT)
// ==========================================
function obtenerMetodoEntrega() {
    const btnActivo = document.querySelector(".delivery-method-btn.active");
    return btnActivo ? btnActivo.dataset.metodo : "domicilio";
}

function validarEstado(selectEstado) {
    if (!selectEstado) return "No se encontró el campo estado.";
    if (selectEstado.value === "") return `<span class="alerta-titulo">Estado:</span> Debes seleccionar un estado.`;
    return undefined;
}

function validarCiudadCheckout(inputCiudad, etiqueta = "Ciudad") {
    if (!inputCiudad) return `No se encontró el campo ${etiqueta.toLowerCase()}.`;
    const ciudad = inputCiudad.value.trim();
    if (ciudad === "") return `<span class="alerta-titulo">${etiqueta}:</span> Debes llenar el campo.`;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(ciudad)) return `<span class="alerta-titulo">${etiqueta}:</span> Solo puede contener letras.`;
    return undefined;
}

function validarDireccion(inputDireccion) {
    if (!inputDireccion) return "No se encontró el campo dirección.";
    const direccion = inputDireccion.value.trim();
    if (direccion === "") return `<span class="alerta-titulo">Dirección:</span> Debes llenar el campo.`;
    if (direccion.length < 5) return `<span class="alerta-titulo">Dirección:</span> Escribe una dirección más completa.`;
    return undefined;
}

function validarNumeroExterior(inputNumExt) {
    if (!inputNumExt) return "No se encontró el campo No. Exterior.";
    const numero = inputNumExt.value.trim();
    if (numero === "") return `<span class="alerta-titulo">No. Exterior:</span> Debes llenar el campo.`;
    if (!/^[a-zA-Z0-9]+$/.test(numero)) return `<span class="alerta-titulo">No. Exterior:</span> Solo se permiten letras y números.`;
    return undefined;
}

function validarNumeroInterior(inputNumInt) {
    if (!inputNumInt) return undefined;
    const numero = inputNumInt.value.trim();
    if (numero !== "" && !/^[a-zA-Z0-9]+$/.test(numero)) {
        return `<span class="alerta-titulo">No. Interior:</span> Solo se permiten letras y números.`;
    }
    return undefined;
}

function validarCodigoPostal(inputCP) {
    if (!inputCP) return "No se encontró el campo Código Postal.";
    const cp = inputCP.value.trim();
    if (cp === "") return `<span class="alerta-titulo">Código Postal:</span> Debes llenar el campo.`;
    if (!/^\d{5}$/.test(cp)) return `<span class="alerta-titulo">Código Postal:</span> Debe tener exactamente 5 dígitos.`;
    return undefined;
}

function validarTelefonoCheckout(inputTelefono) {
    if (!inputTelefono) return "No se encontró el campo teléfono.";
    const telefono = inputTelefono.value.replace(/[\s-]/g, "");
    if (telefono === "") return `<span class="alerta-titulo">Teléfono No válido:</span> Debes llenar el campo.`;
    if (!/^\d{10}$/.test(telefono)) return `<span class="alerta-titulo">Teléfono No válido:</span> El teléfono debe tener exactamente 10 dígitos.`;
    return undefined;
}

function validarCorreoCheckout(inputCorreo) {
    if (!inputCorreo) return "No se encontró el campo correo.";
    const correo = inputCorreo.value.trim();
    if (correo === "") return `<span class="alerta-titulo">Correo Electrónico No válido:</span> Debes llenar el campo.`;
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexCorreo.test(correo)) return `<span class="alerta-titulo">Correo Electrónico No válido:</span> El formato del correo es incorrecto.`;
    return undefined;
}

function mostrarErrorCheckout(selector, mensajeError) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.innerHTML = mensajeError || "";
    }
}

// ==========================================
// FORMULARIO CHECKOUT (Validación de los datos de envío)
// ==========================================
const formularioCheckout = document.getElementById("formulario-checkout");

if (formularioCheckout) {
    formularioCheckout.addEventListener("submit", async function (e) {
        e.preventDefault();

        const inputEstado = document.getElementById("estado");
        const inputCiudad = document.getElementById("ciudad");
        const inputDireccion = document.getElementById("direccion");
        const inputNumExt = document.getElementById("numero-exterior");
        const inputNumInt = document.getElementById("numero-interior");
        const inputCP = document.getElementById("codigo-postal");
        const inputCiudad2 = document.getElementById("ciudad-2");
        const inputTelefono = document.getElementById("telefono");
        const inputCorreo = document.getElementById("correo");

        const selectoresError = [
            "#error-estado p", "#error-ciudad p", "#error-direccion p",
            "#error-numero-exterior p", "#error-numero-interior p",
            "#error-codigo-postal p", "#error-ciudad-2 p",
            "#error-telefono p", "#error-correo p"
        ];

        const metodoEntrega = obtenerMetodoEntrega();

        if (metodoEntrega === "tienda") {
            selectoresError.forEach(sel => mostrarErrorCheckout(sel, ""));
            console.log("Retiro en tienda seleccionado.");
            return;
        }

        const errorEstado = validarEstado(inputEstado);
        const errorCiudad = validarCiudadCheckout(inputCiudad, "Ciudad");
        const errorDireccion = validarDireccion(inputDireccion);
        const errorNumExt = validarNumeroExterior(inputNumExt);
        const errorNumInt = validarNumeroInterior(inputNumInt);
        const errorCP = validarCodigoPostal(inputCP);
        const errorCiudad2 = validarCiudadCheckout(inputCiudad2, "Ciudad");
        const errorTelefono = validarTelefonoCheckout(inputTelefono);
        const errorCorreo = validarCorreoCheckout(inputCorreo);

        mostrarErrorCheckout("#error-estado p", errorEstado);
        mostrarErrorCheckout("#error-ciudad p", errorCiudad);
        mostrarErrorCheckout("#error-direccion p", errorDireccion);
        mostrarErrorCheckout("#error-numero-exterior p", errorNumExt);
        mostrarErrorCheckout("#error-numero-interior p", errorNumInt);
        mostrarErrorCheckout("#error-codigo-postal p", errorCP);
        mostrarErrorCheckout("#error-ciudad-2 p", errorCiudad2);
        mostrarErrorCheckout("#error-telefono p", errorTelefono);
        mostrarErrorCheckout("#error-correo p", errorCorreo);

        const hayErrores = errorEstado || errorCiudad || errorDireccion || errorNumExt ||
            errorNumInt || errorCP || errorCiudad2 || errorTelefono || errorCorreo;

        if (hayErrores) {
            console.warn("Envío bloqueado: revisa los campos de dirección.");
            return;
        }

        console.log("Dirección validada correctamente.");

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
                                   || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        if (!usuarioActivo || !usuarioActivo.id) {
          alert("No se encontró una sesión de usuario activa.");
          return;
        }

        const datosDireccion = {
             calle: inputDireccion.value.trim(),
             numExterior: inputNumExt.value.trim(),
             numInterior: inputNumInt.value.trim() || null,
             codigoPostal: inputCP.value.trim(),
             alcaldia: inputCiudad.value.trim(),
             estado: inputEstado.options[inputEstado.selectedIndex].text,
             tel: inputTelefono.value.trim(),
             email: inputCorreo.value.trim()
        };

        await guardarDireccionEnBackend(usuarioActivo.id, datosDireccion);
    });
}

// ==========================================
// ENVIAR DIRECCIÓN AL BACKEND
// ==========================================
/*
* Toma los datos del formulario y los envía por medio de POST
*/
async function guardarDireccionEnBackend(idUsuario, datosDireccion) {
    try {
        const respuesta = await fetch(`http://44.202.55.123:8080/api/direcciones/${idUsuario}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosDireccion)
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar la dirección en el servidor.');
        }

        const resultado = await respuesta.json();
        console.log("Dirección guardada con éxito:", resultado);
        alert("Dirección guardada correctamente.");
        return true;

    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo guardar la dirección. Verifica los datos o tu conexión.");
        return false;
    }
}

// ==========================================
// VALIDACIONES TARJETA DE CRÉDITO / PAGO
// ==========================================
/*
* Cuando el usuario da en pagar, se obtiene su ID
* Se crea el objeto de métodos de pago
* Guarda la tarjeta
* Ejecuta el checkout
*/
const formularioPago = document.getElementById("formularioPago");

if (formularioPago) {
    formularioPago.addEventListener("submit", async function (e) {
        e.preventDefault();

        const elErrorNombre = document.getElementById("errorNombre");
        const elErrorTarjeta = document.getElementById("errorTarjeta");
        const elErrorFecha = document.getElementById("errorFecha");
        const elErrorCvv = document.getElementById("errorCvv");

        if (elErrorNombre) elErrorNombre.textContent = "";
        if (elErrorTarjeta) elErrorTarjeta.textContent = "";
        if (elErrorFecha) elErrorFecha.textContent = "";
        if (elErrorCvv) elErrorCvv.textContent = "";

        let valido = true;

        const nombre = document.getElementById("nombreTitular")?.value.trim() || "";
        const tarjeta = document.getElementById("numeroTarjeta")?.value.replace(/\s/g, "") || "";
        const mes = document.getElementById("mesExpiracion")?.value || "";
        const anio = document.getElementById("anioExpiracion")?.value || "";
        const cvv = document.getElementById("cvv")?.value.trim() || "";

        // Validar Nombre
        if (nombre === "") {
            if (elErrorNombre) elErrorNombre.textContent = "El nombre del titular es obligatorio.";
            valido = false;
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
            if (elErrorNombre) elErrorNombre.textContent = "Introduce un nombre válido.";
            valido = false;
        }

        // Validar Tarjeta
        if (!/^\d{16}$/.test(tarjeta)) {
            if (elErrorTarjeta) elErrorTarjeta.textContent = "La tarjeta debe tener 16 dígitos.";
            valido = false;
        }

        // Validar Fecha
        if (mes === "" || anio === "") {
            if (elErrorFecha) elErrorFecha.textContent = "Selecciona el mes y año de expiración.";
            valido = false;
        }

        // Validar CVV
        if (!/^\d{3}$/.test(cvv)) {
            if (elErrorCvv) elErrorCvv.textContent = "El CVV debe tener 3 dígitos.";
            valido = false;
        }

        if (valido) {
            const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
                               || JSON.parse(sessionStorage.getItem('usuarioActivo'));

            if (!usuarioActivo || !usuarioActivo.id) {
                alert("No hay una sesión activa.");
                return;
            }

            /*
            Crea un objeto datosMetodoPago
            */
            const datosMetodoPago = {
                numTarjeta: tarjeta,
                fechaExpiracion: `${mes}/${anio}`,
                idUsuario: usuarioActivo.id
            };

            try {
                // Se manda a llamar a MetodosPagoController
                // Nos regresa idMetodoPagoGenerado
                const respuestaTarjeta = await fetch(`http://44.202.55.123:8080/api/metodos-pago/usuario/${usuarioActivo.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosMetodoPago)
                });

                if (!respuestaTarjeta.ok) throw new Error("Error al registrar el método de pago.");

                const tarjetaGuardada = await respuestaTarjeta.json();
                const idMetodoPagoGenerado = tarjetaGuardada.idMetodoPago;

                // Se ejecuta el checkout para generar el pedido y vaciar el carrito
                await ejecutarCheckout(usuarioActivo.id, idMetodoPagoGenerado);

            } catch (error) {
                console.error("Error en el proceso de pago:", error);
                alert("Hubo al procesar tu tarjeta.");
            }
        }
    });
}

// ==========================================
// EJECUTAR CHECKOUT
// ==========================================
/*
* Vincula el método de pago y usuario
* Genera el registro histórico
* Guarda una copia del precio unitario
*/
async function ejecutarCheckout(usuarioId, idMetodoPago) {
    const respuestaCheckout = await fetch(`http://44.202.55.123:8080/api/pedidos/checkout/${usuarioId}?idMetodoPago=${idMetodoPago}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!respuestaCheckout.ok) {
        throw new Error("Error al generar el pedido y migrar el carrito.");
    }

    const pedidoCreado = await respuestaCheckout.json();
    console.log("¡Pedido y detalles creados con éxito!", pedidoCreado);

    alert("¡Pago realizado y pedido generado con éxito!");
    window.location.href = 'index.html';
}