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

// --- 1. CARGA INICIAL Y API ---
async function cargarProductos() {
    try {
        const res = await fetch(API_PRODUCTOS_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");
        const productos = await res.json();

        itemsController.items = [];

        // En Java se maneja la propiedad booleana 'visibilidad'
        const productosActivos = productos.filter(producto => producto.visibilidad === true);

        productosActivos.forEach(producto => {
            itemsController.addItem(
                producto.idProducto,                  // Mapped from Java Model
                producto.nombre,                      // Mapped from Java Model
                producto.descripcion,
                producto.destacado,
                producto.especie,
                producto.peso || '',
                producto.precioVenta,                 // Mapped from Java Model
                producto.marca,
                producto.imagen || 'img/default.jpg', // Fallback si no viene campo imagen en BD
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
        const cumpleMarca = marcaSeleccionada
            ? String(producto.marca).toLowerCase() === String(marcaSeleccionada).toLowerCase()
            : true;

        const cumpleEspecie = especieSeleccionada
            ? String(producto.especie).toLowerCase() === String(especieSeleccionada).toLowerCase()
            : true;

        return cumpleMarca && cumpleEspecie;
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

    // Se asigna data-id con el idProducto obtenido de Spring Boot
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
                        data-id="${producto.idProducto}">
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

        // 1. Obtener datos del usuario activo en la sesión
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
                           || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        // Se extrae el ID del carrito del usuario activo
        const idCarrito = usuarioActivo?.idCarrito || usuarioActivo?.id_usuario || usuarioActivo?.id;

        if (!usuarioActivo || !idCarrito) {
            sessionStorage.setItem('redirectAfterLogin', 'productos.html');
            alert('Debes iniciar sesión para agregar productos al carrito.');
            window.location.href = 'inicioSesion.html';
            return;
        }

        const btn = e.target;
        const idProducto = btn.getAttribute('data-id');

        try {
            // 2. Consumir endpoint: @PostMapping("/{idCarrito}/producto/{idProducto}")
            const response = await fetch(`${API_DETALLE_CARRITO_URL}/${idCarrito}/producto/${idProducto}?cantidad=1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Error al procesar la inserción en el carrito");
            }

            const detalleRespuesta = await response.json(); // Retorna DetalleCarritoResponseDTO

            // 3. Actualizar contador visual de la interfaz
            let contador = parseInt(localStorage.getItem('contadorCarrito')) || 0;
            contador++;
            localStorage.setItem('contadorCarrito', contador);
            actualizarBadgeNavegacion(contador);

            alert(`¡Se agregó "${detalleRespuesta.nombreProducto}" al carrito!`);

        } catch (error) {
            console.error("Error al comunicarse con la API de carrito:", error);
            alert("No se pudo agregar el producto al carrito. Inténtalo de nuevo.");
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