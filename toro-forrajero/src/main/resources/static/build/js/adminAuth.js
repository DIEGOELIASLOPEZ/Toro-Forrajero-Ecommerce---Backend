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