document.addEventListener("DOMContentLoaded", function () {

    // 1. Obtención centralizada del usuario (localStorage o sessionStorage)
    const user = JSON.parse(localStorage.getItem('usuarioActivo'))
        || JSON.parse(sessionStorage.getItem('usuarioActivo'));

    // 2. Inicialización de componentes si hay usuario activo
    if (user) {
        inicializarBotonCuenta();
        renderizarNombreUsuario(user.nombre);
    }

    // --- FUNCIONES DE INTERFAZ ---

    function renderizarNombreUsuario(nombre) {
        // Corrección del selector (usa . para clases o # para id)
        const elemNombre = document.querySelector('.nombre-cuenta');
        
        if (elemNombre) {
            elemNombre.textContent = nombre;
        }
    }

    function inicializarBotonCuenta() {
        const btnCuenta = document.querySelector('.cuenta a');

        if (btnCuenta) {
            btnCuenta.addEventListener('click', function (e) {
                e.preventDefault();
                mostrarModalSesion();
            });
        }
    }

    // --- MODAL Y MANEJO DE SESIÓN ---

    function mostrarModalSesion() {
        const modal = document.createElement('DIV');
        modal.classList.add('modal-overlay');

        const contenidoModal = document.createElement('DIV');
        contenidoModal.classList.add('contenido-modal');

        contenidoModal.innerHTML = `
            <h3>¿Deseas cerrar sesión?</h3>
            <div class="d-flex admin-btns" style="margin-top: 1.5rem; gap: 1rem; justify-content: center;">
                <button type="button" class="btn-cancelar btn-cancelar-sesion">No</button>
                <button type="button" class="btn-confirmar">Sí</button>
            </div>
        `;

        modal.appendChild(contenidoModal);

        // Clic en el fondo oscuro
        modal.addEventListener('click', function (evento) {
            if (evento.target === modal) cerrarModal();
        });

        // Clic en botón NO
        const btnCancelar = contenidoModal.querySelector('.btn-cancelar-sesion');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', cerrarModal);
        }

        // Clic en botón SÍ
        const btnConfirmar = contenidoModal.querySelector('.btn-confirmar');
        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', confirmarCierre);
        }

        document.body.classList.add('overflow-hidden');
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.classList.add('is-visible');
        }, 10);
    }

    function cerrarModal() {
        const modal = document.querySelector('.modal-overlay');

        if (modal) {
            modal.classList.remove('is-visible');
            document.body.classList.remove('overflow-hidden');

            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    function confirmarCierre() {
        localStorage.removeItem('usuarioActivo');
        sessionStorage.removeItem('usuarioActivo');
        window.location.href = "index.html";
    }

});