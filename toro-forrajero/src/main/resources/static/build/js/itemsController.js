// Clase Item Controller
class ItemsController {
    constructor(currentId = 0) {
        this.items = [];
    }

    // Método corregido con el orden exacto del llamado:
    addItem(id, nombreProducto, descripcion, destacado, especie, costo, precio, marca, imagen, estado, existencia) {
        const item = {
            id: id,
            nombreProducto: nombreProducto,
            descripcion: descripcion,
            destacado: destacado,
            especie: especie,
            costo: costo,
            precio: precio,
            marca: marca,
            imagen: imagen,
            estado: estado,
            existencia: existencia
        };

        this.items.push(item);
    }
}

const itemsController = new ItemsController(0);
const API_URL = 'http://44.202.55.123:8080/api/productos';

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
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");
        const productos = await res.json();

        itemsController.items = [];

        const productosActivos = productos.filter(producto =>
            String(producto.estado).toLowerCase() === 'activo'
        );

        productosActivos.forEach(producto => {
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

    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen}" alt="${producto.nombreProducto}">
            <div class="contenido-producto">
                <h2>${producto.nombreProducto}</h2>
                <p>${producto.descripcion}</p>
                <p>Marca: ${producto.marca}</p>
                <span class="precio">$${producto.precio} MXN</span>

                <div class="d-flex admin-btns">
                    <button 
                        type="button" 
                        class="boton-carrito" 
                        data-producto="${producto.nombreProducto}">
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

// --- 4. MOTOR DEL CARRITO (CON VERIFICACIÓN AL HACER CLIC) ---
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('boton-carrito')) {

        // 1. Verificar si hay un usuario activo (Cliente)
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo')) 
                           || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        if (!usuarioActivo) {
            // Muestra el modal personalizado y mantiene al usuario en productos.html
            mostrarModalAcceso('Debes iniciar sesión para agregar productos al carrito.');
            return; // Detener la adición al carrito
        }

        // 2. Si la sesión existe, agregar el producto normalmente
        const btn = e.target;
        const nombreExacto = btn.getAttribute('data-producto');

        const productoSeleccionado = itemsController.items.find(
            producto => String(producto.nombreProducto).trim() === String(nombreExacto).trim()
        );

        if (productoSeleccionado) {
            let carritoProductos = [];
            try {
                carritoProductos = JSON.parse(localStorage.getItem('carrito')) || [];
            } catch (error) {
                carritoProductos = [];
            }

            carritoProductos.push(productoSeleccionado);
            localStorage.setItem('carrito', JSON.stringify(carritoProductos));

            let contador = parseInt(localStorage.getItem('contadorCarrito')) || 0;
            contador++;
            localStorage.setItem('contadorCarrito', contador);

            actualizarBadgeNavegacion(contador);
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