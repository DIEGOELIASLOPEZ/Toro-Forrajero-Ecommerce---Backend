/**
 * ============================================================================
 * INTERCEPTOR DIRECTO PARA EL LI DEL CARRITO (ICONO + TEXTO)
 * ============================================================================
 */
document.addEventListener('click', (e) => {
    // Detecta si el clic ocurrió dentro del <li class="nav-item carrito"> o en el enlace
    const itemCarrito = e.target.closest('li.carrito') || e.target.closest('a[href*="carrito.html"]');

    if (itemCarrito) {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
            || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        // Si NO hay usuario activo, cancelamos el enlace y mostramos el modal personalizado
        if (!usuarioActivo) {
            e.preventDefault();   // Evita que el navegador vaya a carrito.html
            e.stopPropagation();  // Detiene la propagación del evento

            mostrarModalAcceso('Debes iniciar sesión para acceder al carrito.');
        }
    }
}, true);

/**
 * ============================================================================
 * LÓGICA DE RENDERIZADO INTERNA DE CARRITO.HTML
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-productos-carrito');
    const btnPago = document.getElementById('btn-proceder-pago');

    // Si no estamos en la vista de carrito.html, no ejecutamos el renderizado de lista
    if (!contenedor) return;

    const carritoCrudo = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carritoCrudo.length === 0) {
        mostrarCarritoVacio();
        return;
    }

    let carritoAgrupado = agruparProductos(carritoCrudo);
    renderizarCarrito(carritoAgrupado);

    function agruparProductos(arreglo) {
        const resultado = [];
        arreglo.forEach(producto => {
            const existe = resultado.find(p => p.nombreProducto === producto.nombreProducto);
            if (existe) {
                existe.cantidad += 1;
            } else {
                resultado.push({ ...producto, cantidad: 1 });
            }
        });
        return resultado;
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
                                <button class="btn-qty-control btn-sumar" data-nombre="${producto.nombreProducto}" data-index="${index}">+</button>
                                <button class="btn-qty-control btn-restar" data-nombre="${producto.nombreProducto}" data-index="${index}">-</button>
                            </div>
                            <div class="bg-forrajero-orange px-3 py-1 rounded-1 fw-bold fs-5 cantidad-item js-cantidad-${index}">
                                ${producto.cantidad}
                            </div>
                            
                            <button class="btn-eliminar ms-3" data-nombre="${producto.nombreProducto}" data-index="${index}">
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
            btn.addEventListener('click', (e) => {
                const nombre = e.target.getAttribute('data-nombre');
                const indexHtml = e.target.getAttribute('data-index');
                const producto = productos.find(p => p.nombreProducto === nombre);
                
                if (producto) {
                    producto.cantidad += 1;
                    actualizarAlmacenamiento(productos);
                    actualizarDOMItem(producto, indexHtml); 
                }
            });
        });

        btnRestarList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nombre = e.target.getAttribute('data-nombre');
                const indexHtml = e.target.getAttribute('data-index');
                const productoIndex = productos.findIndex(p => p.nombreProducto === nombre);
                
                if (productoIndex !== -1) {
                    const producto = productos[productoIndex];
                    
                    if (producto.cantidad > 1) {
                        producto.cantidad -= 1;
                        actualizarAlmacenamiento(productos);
                        actualizarDOMItem(producto, indexHtml); 
                    } else {
                        eliminarProductoPorCompleto(productos, productoIndex, indexHtml);
                    }
                }
            });
        });

        btnEliminarList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const boton = e.target.closest('.btn-eliminar'); 
                const nombre = boton.getAttribute('data-nombre');
                const indexHtml = boton.getAttribute('data-index');
                const productoIndex = productos.findIndex(p => p.nombreProducto === nombre);

                if (productoIndex !== -1) {
                    eliminarProductoPorCompleto(productos, productoIndex, indexHtml);
                }
            });
        });
    }

    function eliminarProductoPorCompleto(productos, arrayIndex, domIndex) {
        productos.splice(arrayIndex, 1);
        actualizarAlmacenamiento(productos);
        
        const tarjetaDOM = document.getElementById(`tarjeta-${domIndex}`);
        if (tarjetaDOM) {
            tarjetaDOM.remove();
        }

        if (productos.length === 0) {
            mostrarCarritoVacio();
        }
    }

    function actualizarDOMItem(producto, index) {
        const precioTotalArticulo = (parseFloat(producto.precio) * producto.cantidad).toFixed(2);
        const elementoPrecio = document.querySelector(`.js-precio-${index}`);
        const elementoCantidad = document.querySelector(`.js-cantidad-${index}`);

        if (elementoPrecio) elementoPrecio.textContent = `$ ${precioTotalArticulo} MXN`;
        if (elementoCantidad) elementoCantidad.textContent = producto.cantidad;
    }

    function actualizarAlmacenamiento(productosAgrupados) {
        const nuevoCarritoCrudo = [];
        productosAgrupados.forEach(prod => {
            for (let i = 0; i < prod.cantidad; i++) {
                const { cantidad, ...productoOriginal } = prod; 
                nuevoCarritoCrudo.push(productoOriginal);
            }
        });
        
        localStorage.setItem('carrito', JSON.stringify(nuevoCarritoCrudo));
        localStorage.setItem('contadorCarrito', nuevoCarritoCrudo.length);
        
        if (typeof actualizarBadgeNavegacion === 'function') {
            actualizarBadgeNavegacion(nuevoCarritoCrudo.length);
        }
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

    // Cerrar al hacer clic fuera del contenido o en el botón
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
    const usuarioSesion = JSON.parse(localStorage.getItem("usuarioActivo")) 
                        || JSON.parse(sessionStorage.getItem("usuarioActivo"));

    let paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual === "") paginaActual = "index.html";

    // Páginas exclusivas de Administrador
    const paginasAdmin = [
        "adminHome.html", 
        "adminCrear.html", 
        "adminEditar.html"
    ];

    // Páginas exclusivas de Clientes / Usuarios Públicos
    const paginasCliente = [
        "index.html",
        "productos.html",
        "pago.html",
        "acercaNosotros.html",
        "contactanos.html",
        "carrito.html"
    ];

    // 1. CASO ADMIN: Si es ADMIN e intenta entrar a páginas del cliente/tienda
    if (usuarioSesion && usuarioSesion.rol === "admin") {
        if (paginasCliente.includes(paginaActual)) {
            mostrarModalAcceso(
                "Los administradores deben navegar únicamente desde el panel de administración.", 
                "adminHome.html"
            );
            return;
        }
    }

    // 2. CASO CLIENTE / INVITADO: Si intenta ingresar a páginas de administración sin permisos
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