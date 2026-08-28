const API_PRODUCTOS_URL = 'http://localhost:8080/api/productos';

let productosGlobales = [];
let marcaSeleccionada = null;
let especieSeleccionada = null;
let visibilidadSeleccionada = null;

const mapaEspecies = {
    "bovinos": "Vacas",
    "porcinos": "Cerdos",
    "aves": "Aves",
    "ovinos": "Borregos"
};

// --- 1. CARGA INICIAL ---
async function cargarProductosAdmin() {
    try {
        const res = await fetch(API_PRODUCTOS_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");

        productosGlobales = await res.json();
        aplicarFiltrosAdmin();

    } catch (error) {
        console.error("No se pudo cargar el catálogo de administración:", error);
    }
}

// --- 2. FILTRADO ---
function aplicarFiltrosAdmin() {
    const productosFiltrados = productosGlobales.filter(producto => {
        const cumpleMarca = marcaSeleccionada
            ? String(producto.marca).toLowerCase() === String(marcaSeleccionada).toLowerCase()
            : true;

        const cumpleEspecie = especieSeleccionada
            ? String(producto.especie).toLowerCase() === String(especieSeleccionada).toLowerCase()
            : true;

        const estadoTexto = producto.visibilidad ? "activo" : "inactivo";
        const cumpleVisibilidad = visibilidadSeleccionada
            ? estadoTexto === String(visibilidadSeleccionada).toLowerCase()
            : true;

        return cumpleMarca && cumpleEspecie && cumpleVisibilidad;
    });

    renderizarAdminHTML(productosFiltrados);
    estiloVisibilidad();
    inicializarAccionesAdmin();
}

// --- 3. RENDERIZADO DE LA VISTA DE ADMINISTRACIÓN ---
function renderizarAdminHTML(items) {
    const catalogo = document.getElementById('catalogo-productos');
    if (!catalogo) return;

    if (items.length === 0) {
        catalogo.innerHTML = `<p class="no-productos text-center py-5">No se encontraron productos con los filtros seleccionados.</p>`;
        return;
    }

    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen || 'img/default.jpg'}" alt="${producto.nombre}">

            <div class="contenido-producto">
                <h2 class="text-center">${producto.nombre}</h2>
                <p class="admin-home-descripcion" style="min-height: 4.5rem; max-height: 4.5rem; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow-wrap: break-word; word-break: break-word; margin-bottom: 1rem;">${producto.descripcion}</p>
                
                <hr>
                <div class="grid-productos">
                    <div class="datos-columna">
                        <p>ID:<br> <span class="fw-bold">${producto.idProducto}</span></p>
                        <p>Marca:<br> <span class="fw-bold">${producto.marca}</span></p>
                        <p>Especie:<br> <span class="fw-bold">${producto.especie}</span></p>
                    </div>

                    <div class="datos-columna">
                        <p>Existencia:<br> <span class="fw-bold">${producto.stock} unidades</span></p>
                        <p>Costo:<br> <span class="fw-bold">$${producto.costo}</span></p>
                        <p>Precio:<br> <span class="fw-bold">$${producto.precioVenta}</span></p>
                    </div>
                </div>
                <hr>

                <div class="datos-extra">
                    <p class="dato-fila">
                        <span class="etiqueta-texto">Visibilidad:</span>
                        <span class="visibilidad-estilo">${producto.visibilidad ? 'Activo' : 'Inactivo'}</span>
                    </p>

                    <p class="dato-fila">
                        <span class="etiqueta-texto">Destacado:</span>
                        <span class="visibilidad-estilo">${producto.destacado ? 'Sí' : 'No'}</span>
                    </p>
                </div>

                <div class="d-flex admin-btns">
                    <a href="adminEditar.html" type="button" class="boton-carrito editar" data-id="${producto.idProducto}">
                        Editar
                    </a>
                    <button type="button" class="boton-eliminar" data-id="${producto.idProducto}" data-nombre="${producto.nombre}" data-imagen="${producto.imagen || 'img/default.jpg'}">
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// --- 4. ESTILOS DE VISIBILIDAD ---
function estiloVisibilidad() {
    const spans = document.querySelectorAll('.visibilidad-estilo');
    spans.forEach(span => {
        const texto = span.textContent.trim().toLowerCase();
        span.classList.remove("activo", "inactivo", "estado-activo", "estado-inactivo");
        if (texto === 'activo' || texto === 'true' || texto === 'sí') {
            span.classList.add("estado-activo");
        } else if (texto === 'inactivo' || texto === 'false' || texto === 'no') {
            span.classList.add("estado-inactivo");
        }
    });
}

// --- 5. EVENTOS DE FILTROS ---
function inicializarEventosFiltrosAdmin() {
    const botonesEspecie = document.querySelectorAll(".filtro-especies .especie");
    botonesEspecie.forEach(boton => {
        boton.addEventListener("click", () => {
            const especieKey = boton.getAttribute("data-especie");
            const especieNombre = mapaEspecies[especieKey] || especieKey;

            if (boton.classList.contains("activo")) {
                boton.classList.remove("activo");
                especieSeleccionada = null;
            } else {
                botonesEspecie.forEach(btn => btn.classList.remove("activo"));
                boton.classList.add("activo");
                especieSeleccionada = especieNombre;
            }
            aplicarFiltrosAdmin();
        });
    });

    const opcionesMarca = document.querySelectorAll(".filtro-marca");
    opcionesMarca.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const marcaVal = item.getAttribute("data-marca");

            if (marcaSeleccionada === marcaVal) {
                marcaSeleccionada = null;
                item.classList.remove("active");
            } else {
                opcionesMarca.forEach(i => i.classList.remove("active"));
                marcaSeleccionada = marcaVal;
                item.classList.add("active");
            }
            aplicarFiltrosAdmin();
        });
    });

    const opcionesVisibilidad = document.querySelectorAll(".filtro-visibilidad");
    opcionesVisibilidad.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const estadoVal = item.getAttribute("data-estado");

            if (visibilidadSeleccionada === estadoVal) {
                visibilidadSeleccionada = null;
                item.classList.remove("active");
            } else {
                opcionesVisibilidad.forEach(i => i.classList.remove("active"));
                visibilidadSeleccionada = estadoVal;
                item.classList.add("active");
            }
            aplicarFiltrosAdmin();
        });
    });
}

// --- 6. ACCIONES (EDITAR Y ELIMINAR CON MODAL) ---
function inicializarAccionesAdmin() {
    // Botones Editar
    document.querySelectorAll('.editar').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = btn.dataset.id;
            localStorage.setItem('idProductoEditar', id);
            window.location.href = "adminEditar.html";
        });
    });

    // Botones Eliminar
    document.querySelectorAll('.boton-eliminar').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const id = btn.dataset.id;
            const nombre = btn.dataset.nombre;
            const imagen = btn.dataset.imagen;

            const modal = document.createElement('DIV');
            modal.classList.add('modal-overlay');

            const contenidoModal = document.createElement('DIV');
            contenidoModal.classList.add('contenido-modal');

            contenidoModal.innerHTML = `
                <h3>¿Deseas eliminar <br><span class="fw-bold">${nombre}</span>?</h3>
                <img class="admin-img-menu" src="${imagen}" alt="imagen del producto" style="max-width:100px; display:block; margin: 10px auto;">
                <div class="d-flex admin-btns">
                    <button type="button" class="btn-cancelar">No</button>
                    <button type="button" class="btn-confirmar">Sí</button>
                </div>
            `;

            modal.appendChild(contenidoModal);

            modal.addEventListener('click', function (evento) {
                if (evento.target === modal) cerrarModalGenerico(modal);
            });

            contenidoModal.querySelector('.btn-cancelar').addEventListener('click', () => cerrarModalGenerico(modal));

            document.body.classList.add('overflow-hidden');
            document.body.appendChild(modal);

            contenidoModal.querySelector('.btn-confirmar').addEventListener('click', async function () {
                try {
                    const response = await fetch(`${API_PRODUCTOS_URL}/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error("Error al eliminar el producto");

                    cerrarModalGenerico(modal);
                    cargarProductosAdmin(); // Recargar lista fresca del backend
                } catch (error) {
                    console.error("Error en la eliminación:", error);
                    alert("No se pudo eliminar el producto.");
                }
            });

            setTimeout(() => { modal.classList.add('is-visible'); }, 10);
        });
    });
}

function cerrarModalGenerico(modal) {
    if (modal) {
        modal.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => { modal.remove(); }, 300);
    }
}

// --- 7. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosAdmin();
    inicializarEventosFiltrosAdmin();
});