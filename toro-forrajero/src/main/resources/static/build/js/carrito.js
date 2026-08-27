/**
 * ============================================================================
 * CONFIGURACIÓN DE LA API DEL CARRITO (compartida por todo el sitio)
 * ============================================================================
 * idCarrito == idUsuario (confirmado). El backend expone:
 *   GET    /api/detalle-carrito/{idCarrito}/detalles
 *   POST   /api/detalle-carrito/{idCarrito}/producto/{idProducto}?cantidad=N  (suma N a la cantidad)
 *   DELETE /api/detalle-carrito/{idCarrito}/producto/{idProducto}             (quita el producto por completo)
 *   DELETE /api/detalle-carrito/{idCarrito}/vaciar                           (vacía todo el carrito)
 *
 * NOTA: /**
          * Actualiza la cantidad del producto usando el endpoint PUT del backend.
          */
const API_BASE_URL = 'http://localhost:8080/api';

const ENDPOINTS_CARRITO = {
    obtenerDetalles: (idCarrito) =>
        `${API_BASE_URL}/detalle-carrito/${idCarrito}/detalles`,

    agregarProducto: (idCarrito, idProducto, cantidad = 1) =>
        `${API_BASE_URL}/detalle-carrito/${idCarrito}/producto/${idProducto}?cantidad=${cantidad}`,

    actualizarCantidad: (idCarrito, idProducto, cantidad) =>
        `${API_BASE_URL}/detalle-carrito/${idCarrito}/producto/${idProducto}?cantidad=${cantidad}`,

    eliminarProducto: (idCarrito, idProducto) =>
        `${API_BASE_URL}/detalle-carrito/${idCarrito}/producto/${idProducto}`,

    vaciarCarrito: (idCarrito) =>
        `${API_BASE_URL}/detalle-carrito/${idCarrito}/vaciar`,
};

/**
 * Devuelve el usuario logueado actual.
 *
 * NOTA IMPORTANTE PARA CUANDO MIGRES EL LOGIN AL BACKEND REAL:
 * Hoy 'usuarioActivo' viene del login simulado con json-server (db.json),
 * donde el id es un STRING (ej. "1"). El backend real (UsuarioController /
 * api/usuarios) espera un Long numérico como idUsuario, y este mismo id se
 * usa como idCarrito en todas las llamadas a /api/detalle-carrito/{idCarrito}/...
 *
 * Cuando cambies el login para que autentique contra el backend real, el
 * ÚNICO ajuste que necesita este archivo es que usuarioActivo.id sea ese
 * id numérico real (Long) devuelto por /api/usuarios, en vez del id del
 * json-server. No hay que tocar nada más de la lógica del carrito: todas
 * las funciones de aquí ya usan usuarioActivo.id tal cual se los pasen.
 */
function obtenerUsuarioActivo() {
    return JSON.parse(localStorage.getItem('usuarioActivo'))
        || JSON.parse(sessionStorage.getItem('usuarioActivo'));
}

/**
 * Actualiza el número que se ve junto al ícono del carrito en el header.
 * Se puede llamar desde cualquier página (items.js también la usa).
 * Si no se le pasa un número, consulta la API para calcular el total real.
 */
async function actualizarBadgeNavegacion(forzarContador = null) {
    const divcarrito = document.querySelector('.cart-icon-wrapper');
    if (!divcarrito) return;

    let contador = forzarContador;

    if (contador === null) {
        const usuarioActivo = obtenerUsuarioActivo();
        if (!usuarioActivo) {
            contador = 0;
        } else {
            try {
                const respuesta = await fetch(ENDPOINTS_CARRITO.obtenerDetalles(usuarioActivo.id));
                if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
                const detalles = await respuesta.json();
                contador = detalles.reduce((total, d) => total + (d.cantidad || 0), 0);
            } catch (error) {
                console.error('No se pudo actualizar el contador del carrito:', error);
                contador = 0;
            }
        }
    }

    let badge = divcarrito.querySelector('.contador-carrito');
    if (!badge) {
        badge = document.createElement('P');
        badge.classList.add('contador-carrito');
        divcarrito.append(badge);
    }

    if (contador > 0) {
        badge.style.display = 'block';
        badge.innerHTML = contador >= 100 ? `<span class="carrito-mas">+</span>99` : contador;
    } else {
        badge.style.display = 'none';
    }
}

/**
 * ============================================================================
 * INTERCEPTOR DIRECTO PARA EL LI DEL CARRITO (ICONO + TEXTO)
 * ============================================================================
 */
document.addEventListener('click', (e) => {
    const itemCarrito = e.target.closest('li.carrito') || e.target.closest('a[href*="carrito.html"]');

    if (itemCarrito) {
        const usuarioActivo = obtenerUsuarioActivo();

        if (!usuarioActivo) {
            e.preventDefault();
            e.stopPropagation();
            mostrarModalAcceso('Debes iniciar sesión para acceder al carrito.');
        }
    }
}, true);

/**
 * ============================================================================
 * LÓGICA DE RENDERIZADO INTERNA DE CARRITO.HTML (CONECTADA A LA API)
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    // Se actualiza el badge en cualquier página que tenga el ícono del carrito
    actualizarBadgeNavegacion();

    const contenedor = document.getElementById('contenedor-productos-carrito');
    const btnPago = document.getElementById('btn-proceder-pago');

    // Si no estamos en la vista de carrito.html, no ejecutamos el renderizado de lista
    if (!contenedor) return;

    const usuarioActivo = obtenerUsuarioActivo();
    if (!usuarioActivo) {
        mostrarCarritoVacio();
        return;
    }

    const idCarrito = usuarioActivo.id;
    let carritoProductos = []; // [{ idProducto, nombreProducto, descripcion, precio, imagen, cantidad }]

    cargarCarrito();

    async function cargarCarrito() {
        try {
            mostrarCargando();
            const respuesta = await fetch(ENDPOINTS_CARRITO.obtenerDetalles(idCarrito));

            if (!respuesta.ok) {
                throw new Error(`Error al obtener el carrito: ${respuesta.status}`);
            }

            const detalles = await respuesta.json();
            carritoProductos = mapearDetallesDesdeAPI(detalles);

            if (carritoProductos.length === 0) {
                mostrarCarritoVacio();
                return;
            }

            renderizarCarrito(carritoProductos);

        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            mostrarErrorCarga();
        }
    }

    /**
     * Adapta la respuesta del backend (DetalleCarritoResponseDTO) a la forma
     * que usa el resto del script.
     * AJUSTA esto si los nombres de campos reales de tu DTO son distintos.
     */
    function mapearDetallesDesdeAPI(detalles) {
        return detalles.map(detalle => ({
            idProducto: detalle.idProducto ?? detalle.producto?.id ?? detalle.productoId,
            nombreProducto: detalle.nombreProducto ?? detalle.producto?.nombreProducto,
            descripcion: detalle.descripcion ?? detalle.producto?.descripcion,
            precio: detalle.precio ?? detalle.precioUnitario ?? detalle.producto?.precio,
            imagen: detalle.imagen ?? detalle.producto?.imagen,
            cantidad: detalle.cantidad
        }));
    }

    function renderizarCarrito(productos) {
        contenedor.innerHTML = '';

        productos.forEach((producto, index) => {
            const precioTotalArticulo = (parseFloat(producto.precio) * producto.cantidad).toFixed(2);
            const delayClass = `delay-${(index % 3) + 1}`;

            const tarjeta = document.createElement('div');
            tarjeta.className = `card-articulo p-4 mb-5 fade-up ${delayClass}`;
            tarjeta.id = `tarjeta-${index}`;

            tarjeta.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-7">
                        <h2 class="text-forrajero-orange fw-bold mb-3">Artículo ${index + 1}</h2>
                        <h5 class="fw-bold mb-1">${producto.nombreProducto}</h5>
                        <p class="mb-3" style="color: #D4A373; font-size: 0.9rem; line-height: 1.4;">
                            ${producto.descripcion || 'Producto de alta calidad Toro Forrajero.'}
                        </p>
                        <p class="fw-bold fs-5 mb-3 precio-item js-precio-${index}">$ ${precioTotalArticulo} MXN</p>

                        <div class="d-flex align-items-center gap-2">
                            <div class="d-flex flex-column gap-1">
                                <button class="btn-qty-control btn-sumar" data-id-producto="${producto.idProducto}" data-index="${index}">+</button>
                                <button class="btn-qty-control btn-restar" data-id-producto="${producto.idProducto}" data-index="${index}">-</button>
                            </div>
                            <div class="bg-forrajero-orange px-3 py-1 rounded-1 fw-bold fs-5 cantidad-item js-cantidad-${index}">
                                ${producto.cantidad}
                            </div>

                            <button class="btn-eliminar ms-3" data-id-producto="${producto.idProducto}" data-index="${index}">
                                <i class="bi bi-trash3 me-1"></i> Eliminar artículo
                            </button>
                        </div>
                    </div>

                    <div class="col-md-5 mt-4 mt-md-0 text-center">
                        <div class="img-producto-box h-100 d-flex align-items-center justify-content-center">
                            <img src="${producto.imagen}" alt="${producto.nombreProducto}" class="img-fluid" style="max-height: 250px;">
                        </div>
                    </div>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });

        asignarEventosBotones(productos);
        if (btnPago) btnPago.style.display = 'block';
    }

    function asignarEventosBotones(productos) {
        const btnSumarList = document.querySelectorAll('.btn-sumar');
        const btnRestarList = document.querySelectorAll('.btn-restar');
        const btnEliminarList = document.querySelectorAll('.btn-eliminar');

        btnSumarList.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idProducto = e.target.getAttribute('data-id-producto');
                const indexHtml = e.target.getAttribute('data-index');
                const producto = productos.find(p => String(p.idProducto) === idProducto);

                if (producto) {
                    const cantidadAnterior = producto.cantidad;
                    producto.cantidad += 1;
                    actualizarDOMItem(producto, indexHtml);

                    const ok = await sumarUnoEnAPI(idProducto);
                    if (!ok) {
                        producto.cantidad = cantidadAnterior;
                        actualizarDOMItem(producto, indexHtml);
                    } else {
                        actualizarBadgeNavegacion();
                    }
                }
            });
        });

        btnRestarList.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idProducto = e.target.getAttribute('data-id-producto');
                const indexHtml = e.target.getAttribute('data-index');
                const productoIndex = productos.findIndex(p => String(p.idProducto) === idProducto);

                if (productoIndex !== -1) {
                    const producto = productos[productoIndex];

                    if (producto.cantidad > 1) {
                        const cantidadNueva = producto.cantidad - 1;
                        const ok = await restarUnoEnAPI(idProducto, cantidadNueva);
                        if (ok) {
                            producto.cantidad = cantidadNueva;
                            actualizarDOMItem(producto, indexHtml);
                            actualizarBadgeNavegacion();
                        }
                    } else {
                        await eliminarProductoPorCompleto(productos, productoIndex, indexHtml, idProducto);
                    }
                }
            });
        });

        btnEliminarList.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const boton = e.target.closest('.btn-eliminar');
                const idProducto = boton.getAttribute('data-id-producto');
                const indexHtml = boton.getAttribute('data-index');
                const productoIndex = productos.findIndex(p => String(p.idProducto) === idProducto);

                if (productoIndex !== -1) {
                    await eliminarProductoPorCompleto(productos, productoIndex, indexHtml, idProducto);
                }
            });
        });
    }

    /**
     * El endpoint POST suma la cantidad indicada a la que ya existe.
     * Para "+1" mandamos cantidad=1.
     */
    async function sumarUnoEnAPI(idProducto) {
        try {
            const respuesta = await fetch(ENDPOINTS_CARRITO.agregarProducto(idCarrito, idProducto, 1), {
                method: 'POST'
            });
            if (!respuesta.ok) throw new Error(`Error al sumar cantidad: ${respuesta.status}`);
            return true;
        } catch (error) {
            console.error('Error al sumar cantidad en el servidor:', error);
            alert('No se pudo actualizar la cantidad. Intenta de nuevo.');
            return false;
        }
    }

    /**
     * No existe endpoint de "restar", así que eliminamos el producto y lo
     * volvemos a agregar con la cantidad ya reducida.
     */
    async function restarUnoEnAPI(idProducto, cantidadNueva) {
        try {

            const respuesta = await fetch(
                ENDPOINTS_CARRITO.actualizarCantidad(
                    idCarrito,
                    idProducto,
                    cantidadNueva
                ),
                {
                    method: 'PUT'
                }
            );

            if (!respuesta.ok) {
                throw new Error(
                    `Error al actualizar cantidad: ${respuesta.status}`
                );
            }

            return true;

        } catch (error) {
            console.error('Error al restar cantidad en el servidor:', error);
            alert('No se pudo actualizar la cantidad. Intenta de nuevo.');
            return false;
        }
    }

    async function eliminarProductoPorCompleto(productos, arrayIndex, domIndex, idProducto) {
        try {
            const respuesta = await fetch(ENDPOINTS_CARRITO.eliminarProducto(idCarrito, idProducto), {
                method: 'DELETE'
            });

            if (!respuesta.ok) {
                throw new Error(`Error al eliminar el producto: ${respuesta.status}`);
            }

            productos.splice(arrayIndex, 1);

            const tarjetaDOM = document.getElementById(`tarjeta-${domIndex}`);
            if (tarjetaDOM) {
                tarjetaDOM.remove();
            }

            actualizarBadgeNavegacion();

            if (productos.length === 0) {
                mostrarCarritoVacio();
            }

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('No se pudo eliminar el producto. Intenta de nuevo.');
        }
    }

    function actualizarDOMItem(producto, index) {
        const precioTotalArticulo = (parseFloat(producto.precio) * producto.cantidad).toFixed(2);
        const elementoPrecio = document.querySelector(`.js-precio-${index}`);
        const elementoCantidad = document.querySelector(`.js-cantidad-${index}`);

        if (elementoPrecio) elementoPrecio.textContent = `$ ${precioTotalArticulo} MXN`;
        if (elementoCantidad) elementoCantidad.textContent = producto.cantidad;
    }

    function mostrarCargando() {
        contenedor.innerHTML = `
            <div class="text-center p-5">
                <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando tu carrito...</p>
            </div>
        `;
    }

    function mostrarErrorCarga() {
        contenedor.innerHTML = `
            <div class="text-center p-5 fade-up">
                <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                <h3 class="mt-3 text-muted">No se pudo cargar tu carrito</h3>
                <p class="text-muted">Intenta recargar la página.</p>
            </div>
        `;
        if (btnPago) btnPago.style.display = 'none';
    }

    function mostrarCarritoVacio() {
        contenedor.innerHTML = `
            <div class="text-center p-5 fade-up">
                <i class="bi bi-cart-x text-muted" style="font-size: 4rem;"></i>
                <h3 class="mt-3 text-muted">Tu carrito está vacío</h3>
                <a href="productos.html" class="btn btn-outline-dark mt-3">Ir a la tienda</a>
            </div>
        `;
        if (btnPago) btnPago.style.display = 'none';
    }
});

// ====================================================
// MODAL DE ACCESO / ALERTA REUTILIZABLE
// ====================================================
function mostrarModalAcceso(mensaje, urlRedireccion = null) {
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

    const ejecutarCierre = () => {
        modal.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
            modal.remove();
            if (urlRedireccion) {
                window.location.href = urlRedireccion;
            }
        }, 300);
    };

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) ejecutarCierre();
    });

    const btnEntendido = contenidoModal.querySelector('.btn-cancelar');
    btnEntendido?.addEventListener('click', ejecutarCierre);

    document.body.classList.add('overflow-hidden');
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add('is-visible');
    }, 10);
}

// ====================================================
// CONTROL DE ACCESOS CENTRALIZADO
// ====================================================
(function controlarAccesos() {
    const usuarioSesion = obtenerUsuarioActivo();

    let paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual === "") paginaActual = "index.html";

    const paginasAdmin = [
        "adminHome.html",
        "adminCrear.html",
        "adminEditar.html"
    ];

    const paginasCliente = [
        "index.html",
        "productos.html",
        "pago.html",
        "acercaNosotros.html",
        "contactanos.html",
        "carrito.html"
    ];

    if (usuarioSesion && usuarioSesion.rol === "admin") {
        if (paginasCliente.includes(paginaActual)) {
            mostrarModalAcceso(
                "Los administradores deben navegar únicamente desde el panel de administración.",
                "adminHome.html"
            );
            return;
        }
    }

    if (paginasAdmin.includes(paginaActual)) {
        if (!usuarioSesion || usuarioSesion.rol !== "admin") {
            mostrarModalAcceso(
                "Acceso denegado. Se requieren permisos de administrador.",
                "inicioSesion.html"
            );
            return;
        }
    }
})();