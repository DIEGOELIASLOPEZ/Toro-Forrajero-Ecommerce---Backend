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

// --- 1. CARGA INICIAL Y API (SE ADAPTA SEGÚN LA VISTA) ---
async function cargarProductos() {
    try {
        const contenedorDestacados = document.getElementById('catalogo-destacados');
        const contenedorCatalogo = document.getElementById('catalogo-productos');

        // Si estamos en la página que tiene el contenedor de destacados (index.html)
        if (contenedorDestacados) {
            const res = await fetch(`${API_PRODUCTOS_URL}/destacados`);
            if (!res.ok) throw new Error("Error al obtener Productos Destacados");
            const destacados = await res.json();

            const productosActivos = destacados.filter(producto => producto.visibilidad === true);
            renderizarHTML(productosActivos, 'catalogo-destacados');
        }

        // Si estamos en la página de catálogo general (productos.html)
        if (contenedorCatalogo) {
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
        }

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

    renderizarHTML(productosFiltrados, 'catalogo-productos');
}

function renderizarHTML(items, idContenedor = 'catalogo-productos') {
    const catalogo = document.getElementById(idContenedor);
    if (!catalogo) return;

    if (items.length === 0) {
        catalogo.innerHTML = `<p class="no-productos">No se encontraron productos disponibles.</p>`;
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
                        data-id="${producto.id || producto.idProducto}">
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

        if (!usuarioActivo) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            alert('Debes iniciar sesión para agregar productos al carrito.');
            window.location.href = 'inicioSesion.html';
            return;
        }

        const idCarrito = usuarioActivo.idCarrito || usuarioActivo.idUsuario || usuarioActivo.id;
        const idProducto = e.target.getAttribute('data-id');

        if (!idProducto || idProducto === 'undefined') {
            console.error("No se pudo obtener el ID del producto.");
            alert("Error al identificar el producto.");
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

            await res.json();

            let contador = parseInt(localStorage.getItem('contadorCarrito')) || 0;
            contador++;
            localStorage.setItem('contadorCarrito', contador);
            actualizarBadgeNavegacion(contador);

            alert(`¡Producto agregado exitosamente al carrito!`);

        } catch (error) {
            console.error("No se pudo agregar al carrito:", error);
            alert("Ocurrió un error al intentar agregar el producto.");
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