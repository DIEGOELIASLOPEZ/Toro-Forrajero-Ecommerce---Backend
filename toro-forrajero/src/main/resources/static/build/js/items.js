class ItemsController {
    constructor(currentId = 0) {
        this.items = [];
    }

    addItem(idProducto, nombre, descripcion, destacado, especie, costo, precioVenta, marca, imagen, visibilidad, stock) {
        const item = {
            idProducto: idProducto,
            nombre: nombre,
            descripcion: descripcion,
            destacado: destacado,
            especie: especie,
            costo: costo,
            precioVenta: precioVenta,
            marca: marca,
            imagen: imagen,
            visibilidad: visibilidad,
            stock: stock
        };

        this.items.push(item);
    }
}

const itemsController = new ItemsController(0);

// Base URLs para tus controllers de Java Spring Boot
const API_PRODUCTOS_URL = 'http://localhost:8080/api/productos';
const API_DETALLE_CARRITO_URL = 'http://localhost:8080/api/detalle-carrito';

let marcaSeleccionada = null;
let especieSeleccionada = null;

const mapaEspecies = {
    "bovinos": "Bovinos",
    "porcinos": "Porcinos",
    "aves": "Aves",
    "ovinos": "Ovinos"
};

const botonesMarca = [
    { id: 'todas-marcas', marca: null },
    { id: 'adm', marca: 'ADM' },
    { id: 'nogal', marca: 'El Nogal' },
    { id: 'arandas', marca: 'Alimentos Arandas' }
];

// --- FUNCION MODAL ESTILO ADMINHOME PARA MENSAJES ---
function mostrarModalMensaje(mensaje, imagenUrl = null, recargarAlCerrar = false) {
    const modal = document.createElement('DIV');
    modal.classList.add('modal-overlay');

    const contenidoModal = document.createElement('DIV');
    contenidoModal.classList.add('contenido-modal');

    let contenidoHTML = `
        <h3 class="text-center mb-3">${mensaje}</h3>
    `;

    if (imagenUrl) {
        contenidoHTML += `
            <img class="admin-img-menu" src="${imagenUrl}" alt="imagen del producto" style="max-width:100px; display:block; margin: 10px auto; border-radius: 8px;">
        `;
    }

    contenidoHTML += `
        <div class="d-flex admin-btns justify-content-center mt-4">
            <button type="button" class="btn-confirmar" style="width: 100%;">Aceptar</button>
        </div>
    `;

    contenidoModal.innerHTML = contenidoHTML;
    modal.appendChild(contenidoModal);

    const cerrarModal = () => {
        modal.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
            modal.remove();
            if (recargarAlCerrar) {
                window.location.reload();
            }
        }, 300);
    };

    modal.addEventListener('click', function (evento) {
        if (evento.target === modal) cerrarModal();
    });

    contenidoModal.querySelector('.btn-confirmar').addEventListener('click', cerrarModal);

    document.body.classList.add('overflow-hidden');
    document.body.appendChild(modal);

    setTimeout(() => { modal.classList.add('is-visible'); }, 10);
}

// --- 1. CARGA INICIAL Y API ---
async function cargarProductos() {
    try {
        const res = await fetch(API_PRODUCTOS_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");
        const productos = await res.json();

        itemsController.items = [];

        const productosActivos = productos.filter(producto => producto.visibilidad === true);

        productosActivos.forEach(producto => {
            itemsController.addItem(
                producto.idProducto,
                producto.nombre,
                producto.descripcion,
                producto.destacado,
                producto.especie,
                producto.peso || '',
                producto.precioVenta,
                producto.marca,
                producto.imagen || 'img/default.jpg',
                producto.visibilidad
            );
        });

        aplicarFiltros();
        actualizarBadgeNavegacion();

    } catch (error) {
        console.error("No se pudo cargar el catálogo:", error);
    }
}

// --- 2. RENDERIZADO Y FILTROS ---
function aplicarFiltros() {
    const productosFiltrados = itemsController.items.filter(producto => {
        const esDestacado = producto.destacado === true || producto.destacado === 1;

        const cumpleMarca = marcaSeleccionada
            ? String(producto.marca).toLowerCase() === String(marcaSeleccionada).toLowerCase()
            : true;

        const cumpleEspecie = especieSeleccionada
            ? String(producto.especie).toLowerCase() === String(especieSeleccionada).toLowerCase()
            : true;

        return esDestacado && cumpleMarca && cumpleEspecie;
    });

    renderizarHTML(productosFiltrados);
}

function renderizarHTML(items) {
    const catalogo = document.getElementById('catalogo-productos');
    if (!catalogo) return;

    if (items.length === 0) {
        catalogo.innerHTML = `<p class="no-productos">No se encontraron productos con los filtros seleccionados.</p>`;
        return;
    }

    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen || 'img/default.jpg'}" alt="${producto.nombre}">
            <div class="contenido-producto">
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <p>Marca: ${producto.marca}</p>
                <span class="precio">$${producto.precioVenta || producto.precio} MXN</span>

                <div class="d-flex admin-btns">
                    <button
                        type="button"
                        class="boton-carrito"
                        data-id="${producto.id || producto.idProducto}"
                        data-nombre="${producto.nombre}"
                        data-imagen="${producto.imagen || 'img/default.jpg'}">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// --- 3. EVENTOS DE FILTRADO ---
function inicializarEventosFiltros() {
    const textoMarcaSeleccionada = document.getElementById('texto-marca');

    botonesMarca.forEach(({ id, marca }) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            botonesMarca.forEach(b => document.getElementById(b.id)?.classList.remove('active'));
            btn.classList.add('active');

            if (textoMarcaSeleccionada) {
                textoMarcaSeleccionada.textContent = btn.textContent.trim();
            }

            marcaSeleccionada = marca;
            aplicarFiltros();
        });
    });

    const botonesEspecie = document.querySelectorAll(".filtro-especies .especie");

    botonesEspecie.forEach(boton => {
        boton.addEventListener("click", () => {
            const especieData = boton.getAttribute("data-especie");
            const especieNombre = mapaEspecies[especieData] || especieData;

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
}

// --- 4. MOTOR DEL CARRITO (PERSISTENCIA VÍA BACKEND SPRING BOOT) ---
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('boton-carrito')) {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
            || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        const nombreProducto = e.target.getAttribute('data-nombre') || 'Producto';
        const imagenProducto = e.target.getAttribute('data-imagen') || 'img/default.jpg';

        if (!usuarioActivo) {
            sessionStorage.setItem('redirectAfterLogin', 'productos.html');
            mostrarModalMensaje('Debes iniciar sesión para agregar productos al carrito.', null, false);
            setTimeout(() => {
                window.location.href = 'inicioSesion.html';
            }, 1200);
            return;
        }

        const idCarrito = usuarioActivo.idCarrito || usuarioActivo.idUsuario || usuarioActivo.id;
        const idProducto = e.target.getAttribute('data-id');

        if (!idProducto || idProducto === 'undefined') {
            console.error("No se pudo obtener el ID del producto.");
            mostrarModalMensaje("Error al identificar el producto.");
            return;
        }

        try {
            const res = await fetch(`${API_DETALLE_CARRITO_URL}/${idCarrito}/producto/${idProducto}?cantidad=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error("Error al añadir el producto.");

            let contador = parseInt(localStorage.getItem('contadorCarrito')) || 0;
            contador++;
            localStorage.setItem('contadorCarrito', contador);

            // Mostrar modal estilo adminHome y recargar al aceptar para actualizar contador
            mostrarModalMensaje(
                `¡<span class="fw-bold">${nombreProducto}</span> se agregó exitosamente al carrito!`,
                imagenProducto,
                true
            );

        } catch (error) {
            console.error("No se pudo agregar al carrito:", error);
            mostrarModalMensaje("Ocurrió un error al intentar agregar el producto.");
        }
    }
});

function actualizarBadgeNavegacion(forzarContador = null) {
    const divcarrito = document.querySelector('.cart-icon-wrapper');
    if (!divcarrito) return;

    let carrito = divcarrito.querySelector('.contador-carrito');
    if (!carrito) {
        carrito = document.createElement('P');
        carrito.classList.add('contador-carrito');
        divcarrito.append(carrito);
    }

    let contador = forzarContador !== null
        ? forzarContador
        : (parseInt(localStorage.getItem('contadorCarrito')) || 0);

    if (contador > 0) {
        carrito.style.display = 'block';
        carrito.innerHTML = contador >= 100 ? `<span class="carrito-mas">+</span>99` : contador;
    } else {
        carrito.style.display = 'none';
    }
}

// --- 5. PUNTO DE ENTRADA ÚNICO ---
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    inicializarEventosFiltros();
});