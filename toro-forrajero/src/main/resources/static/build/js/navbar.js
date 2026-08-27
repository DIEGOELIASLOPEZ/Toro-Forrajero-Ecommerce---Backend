document.addEventListener("DOMContentLoaded", function () {
    const navbarAdmin = document.querySelector("#navbarAdmin");
    const linkProductos = document.querySelector("#linkProductos");

    try {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

        if (usuarioActivo && usuarioActivo.rol === "admin") {
            // Mostrar menú administrativo
            if (navbarAdmin) {
                navbarAdmin.classList.remove("d-none");
                navbarAdmin.classList.add("d-flex");
            }

            // Redirigir la pestaña PRODUCTOS a la vista del Admin
            if (linkProductos) {
                linkProductos.addEventListener("click", function (e) {
                    e.preventDefault();
                    window.location.href = "adminHome.html";
                });
            }
        } else {
            // Ocultar barra administrativa para no-admins
            if (navbarAdmin) {
                navbarAdmin.classList.remove("d-flex");
                navbarAdmin.classList.add("d-none");
            }
        }
    } catch (error) {
        if (navbarAdmin) {
            navbarAdmin.classList.remove("d-flex");
            navbarAdmin.classList.add("d-none");
        }
    }
});