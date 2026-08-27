import { cargarProducto } from './adminEditar.js';

const itemsController = new ItemsController(0);
const API_URL = 'http://localhost:3000/productos';

// Mapeo de especies para los botones del filtro
const mapaEspecies = {
    "bovinos": "Vacas",
    "porcinos": "Cerdos",
    "aves": "Aves",
    "ovinos": "Borregos"
};

// Variables globales de estado para el filtrado
let especieSeleccionada = null;
let marcaSeleccionada = null;
let visibilidadSeleccionada = null;

// ====================================================
// INICIALIZACIÓN
// ====================================================
document.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
    gestionarNavegacionAdmin();
    inicializarEventosFiltros();
    inicializarTextoFiltros();
});

// Helper para verificar rol en la renderización de la UI
function esAdmin() {
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioActivo')) 
                       || JSON.parse(sessionStorage.getItem('usuarioActivo'));
    return usuarioSesion && usuarioSesion.rol === 'admin';
}

function gestionarNavegacionAdmin() {
    const enlaceNuevoProducto = document.querySelector('a[href="adminCrear.html"]');
    if (enlaceNuevoProducto && !esAdmin()) {
        enlaceNuevoProducto.parentElement.style.display = 'none';
    }
}

// ====================================================
// CARGA Y FILTRADO DE PRODUCTOS
// ====================================================
async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");
        const productos = await res.json();

        itemsController.items = [];

        productos.forEach(producto => {
            itemsController.addItem(
                producto.id,
                producto.nombreProducto,
                producto.descripcion,
                producto.destacado,
                producto.especie,
                producto.costo,
                producto.precio,
                producto.marca,
                producto.imagen,
                producto.estado,
                producto.existencia
            );
        });

        aplicarFiltros();

    } catch (error) {
        console.error("No se pudo cargar el catálogo:", error);
    }
}

function aplicarFiltros() {
    const productosFiltrados = itemsController.items.filter(producto => {
        // Filtro Especie
        const cumpleEspecie = especieSeleccionada 
            ? String(producto.especie).toLowerCase() === String(especieSeleccionada).toLowerCase() 
            : true;

        // Filtro Marca
        const cumpleMarca = marcaSeleccionada 
            ? String(producto.marca).toLowerCase() === String(marcaSeleccionada).toLowerCase() 
            : true;

        // Filtro Visibilidad (Estado: Activo/Inactivo)
        const cumpleVisibilidad = visibilidadSeleccionada 
            ? String(producto.estado).toLowerCase() === String(visibilidadSeleccionada).toLowerCase() 
            : true;

        return cumpleEspecie && cumpleMarca && cumpleVisibilidad;
    });

    renderizarHTML(productosFiltrados);
    estiloVisibilidad();

    if (esAdmin()) {
        eliminarProductoMenu();
    }
}

// ====================================================
// LÓGICA DE FILTROS (ESPECIE, MARCA, VISIBILIDAD)
// ====================================================
function inicializarEventosFiltros() {
    // 1. Filtro de Especies
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
            aplicarFiltros();
        });
    });

    // 2. Filtro de Marcas
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
            aplicarFiltros();
        });
    });

    // 3. Filtro de Visibilidad
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
            aplicarFiltros();
        });
    });
}

function inicializarTextoFiltros() {
    document.querySelectorAll('.filtro-marca').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const texto = e.target.textContent;
            const elem = document.getElementById('textoMarcaSeleccionada');
            if (elem) elem.textContent = texto;
        });
    });

    document.querySelectorAll('.filtro-visibilidad').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const texto = e.target.textContent;
            const elem = document.getElementById('textoVisibilidadSeleccionada');
            if (elem) elem.textContent = texto;
        });
    });
}

// ====================================================
// RENDERIZADO Y DOM
// ====================================================
function estiloVisibilidad() {
    const spans = document.querySelectorAll('.visibilidad-estilo');

    spans.forEach(span => {
        const texto = span.textContent.trim().toLowerCase();
        span.classList.remove("activo", "inactivo", "estado-activo", "estado-inactivo");
        if (texto === 'activo' || texto === 'true') {
            span.classList.add("estado-activo");
        } else if (texto === 'inactivo' || texto === 'false') {
            span.classList.add("estado-inactivo");
        }
    });
}

function renderizarHTML(items) {
    const catalogo = document.getElementById('catalogo-productos');
    if (!catalogo) return;

    if (items.length === 0) {
        catalogo.innerHTML = `<p class="text-center w-100 my-5">No se encontraron productos con los filtros seleccionados.</p>`;
        return;
    }

    const esUserAdmin = esAdmin();

    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen}" alt="${producto.nombreProducto}">

            <div class="contenido-producto">
                <h2 class="text-center">${producto.nombreProducto}</h2>
                <p class="admin-home-descripcion">${producto.descripcion}</p>
                
                <hr>
                <div class="grid-productos">
                    <div class="datos-columna">
                        <p>ID:<br> <span class="fw-bold">${producto.id}</span></p>
                        <p>Marca:<br> <span class="fw-bold">${producto.marca}</span></p>
                        <p>Especie:<br> <span class="fw-bold">${producto.especie}</span></p>
                    </div>

                    <div class="datos-columna">
                        <p>Existencia:<br> <span class="fw-bold">${producto.existencia} unidades</span></p>
                        <p>Costo:<br> <span class="fw-bold">$${producto.costo}</span></p>
                        <p>Precio:<br> <span class="fw-bold">$${producto.precio}</span></p>
                    </div>
                </div>
                <hr>

                <div class="datos-extra">
                    <p class="dato-fila">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                        <span class="etiqueta-texto">Visibilidad:</span>
                        <span class="visibilidad-estilo">${producto.estado}</span>
                    </p>

                    <p class="dato-fila">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <span class="etiqueta-texto">Destacado:</span>
                        <span class="visibilidad-estilo">${producto.destacado}</span>
                    </p>
                </div>

                ${esUserAdmin ? `
                    <div class="d-flex admin-btns">
                        <a href="adminEditar.html" type="button" class="boton-carrito editar" data-id="${producto.id}"
                            data-producto="${producto.nombreProducto}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                            </svg>
                            Editar
                        </a>
                        <button type="button" class="boton-eliminar" data-id="${producto.id}"
                            data-producto="${producto.nombreProducto}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                            Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
        </article>
    `).join('');

    if (esUserAdmin) {
        obtenerInfomacion();
    }
}

// ====================================================
// MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
// ====================================================
function eliminarProductoMenu() {
    const btns = document.querySelectorAll('.boton-eliminar');

    btns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const idBtn = e.target.closest('button').dataset.id;
            const productoEncontrado = itemsController.items.find(item => String(item.id) === String(idBtn));

            if (!productoEncontrado) return;

            const id = productoEncontrado.id;
            const nombre = productoEncontrado.nombreProducto;
            const imagen = productoEncontrado.imagen;

            const modal = document.createElement('DIV');
            modal.classList.add('modal-overlay');

            const contenidoModal = document.createElement('DIV');
            contenidoModal.classList.add('contenido-modal');

            contenidoModal.innerHTML = `
                <h3>¿Deseas eliminar <br><span class="fw-bold">${nombre}</span>?</h3>
                <img class="admin-img-menu" src="${imagen}" alt="imagen del producto">
                <div class="d-flex admin-btns">
                    <button type="button" class="btn-cancelar">No</button>
                    <button type="button" class="btn-confirmar">Sí</button>
                </div>
            `;

            modal.appendChild(contenidoModal);

            modal.addEventListener('click', function (evento) {
                if (evento.target === modal) cerrarModalGenerico('.modal-overlay');
            });

            const btnCancelar = contenidoModal.querySelector('.btn-cancelar');
            btnCancelar.addEventListener('click', () => cerrarModalGenerico('.modal-overlay'));

            document.body.classList.add('overflow-hidden');
            document.body.appendChild(modal);

            const btnConfirmar = contenidoModal.querySelector('.btn-confirmar');
            btnConfirmar.addEventListener('click', function () {
                deleteProduct(id);
            });

            setTimeout(() => {
                modal.classList.add('is-visible');
            }, 10);
        });
    });
}

async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        itemsController.items = itemsController.items.filter(item => String(item.id) !== String(productId));
        aplicarFiltros();
        cerrarModalGenerico('.modal-overlay');
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
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

// ====================================================
// NAVEGACIÓN Y EDICIÓN
// ====================================================
export function obtenerInfomacion() {
    const btnsEditar = document.querySelectorAll('.editar');

    btnsEditar.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const id = btn.dataset.id;
            localStorage.setItem('idProductoEditar', id);
            cargarProducto(id);
            window.location.href = "adminEditar.html";
        });
    });
}