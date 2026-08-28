// Script Split Text (animación de letras del hero)
function splitText(element, delayStep = 0.04) {
    const nodes = Array.from(element.childNodes);
    element.innerHTML = "";
    let index = 0;

    nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const cleanText = node.textContent.replace(/\s+/g, " ").trim();
            if (cleanText.length === 0) return;

            const words = cleanText.split(" ");

            words.forEach((word, wIdx) => {
                if (word.length > 0) {
                    const wordSpan = document.createElement("span");
                    wordSpan.style.display = "inline-block";

                    word.split("").forEach((char) => {
                        const span = document.createElement("span");
                        span.className = "split-char";
                        span.textContent = char;
                        span.style.animationDelay = `${index * delayStep}s`;
                        index++;
                        wordSpan.appendChild(span);
                    });

                    element.appendChild(wordSpan);
                }

                if (wIdx < words.length - 1) {
                    const spaceSpan = document.createElement("span");
                    spaceSpan.className = "split-space";
                    spaceSpan.innerHTML = "&nbsp;";
                    element.appendChild(spaceSpan);
                }
            });
        } else {
            element.appendChild(node.cloneNode(true));
        }
    });
}

const itemsController = new ItemsController(0);

// Endpoints Spring Boot
const API_PRODUCTOS_URL = 'http://localhost:8080/api/productos';
const API_DETALLE_CARRITO_URL = 'http://localhost:8080/api/detalle-carrito';

document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) splitText(heroTitle);

    cargarProductosDestacados();
});

// FUNCIÓN ACTUALIZADA Y CORREGIDA
async function cargarProductosDestacados() {
    try {
        const res = await fetch(`${API_PRODUCTOS_URL}/destacados`);
        if (!res.ok) throw new Error("Error al obtener productos destacados");
        const productos = await res.json();

        itemsController.items = [];

        // Función auxiliar para normalizar valores bit(1), booleans, arrays y strings
        const normalizarBooleano = (valor) => {
            if (valor === true || valor === 1) return true;
            if (Array.isArray(valor) && valor.length > 0) return valor[0] === 1 || valor[0] === true;
            if (typeof valor === 'string') {
                const lower = valor.trim().toLowerCase();
                return lower === 'true' || lower === '1' || lower === 'activo';
            }
            return Boolean(valor);
        };

        // Filtrado normalizado
        const productosDestacados = productos.filter(producto => {
            const esVisible = normalizarBooleano(producto.visibilidad);
            const esDestacado = normalizarBooleano(producto.destacado);
            return esVisible && esDestacado;
        });

        // Mapear respetando los parámetros de ItemsController
        productosDestacados.forEach(p => {
            itemsController.addItem(
                p.idProducto,
                p.nombre,
                p.descripcion,
                p.destacado,
                p.especie,
                p.costo || 0,
                p.precioVenta,
                p.marca,
                p.imagen || 'img/default.jpg',
                p.visibilidad,
                p.stock || 0
            );
        });

        // Inyectar HTML
        renderizarHTML(itemsController.items);

        if (typeof actualizarBadgeNavegacion === 'function') {
            actualizarBadgeNavegacion();
        }

    } catch (error) {
        console.error("No se pudieron cargar los productos destacados:", error);
    }
}

function renderizarHTML(items) {
    const catalogo = document.getElementById('catalogo-productos');
    if (!catalogo) return;

    if (!items || items.length === 0) {
        catalogo.innerHTML = `<p class="sin-productos" style="grid-column: 1 / -1; text-align: center;">No hay productos destacados disponibles en este momento.</p>`;
        return;
    }

    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen || 'img/default.jpg'}" alt="${producto.nombre}">
            <div class="contenido-producto">
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <p>Marca: ${producto.marca}</p>
                <span class="precio">$${producto.precioVenta} MXN</span>

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

// Interceptor para agregar al carrito en Backend
document.addEventListener('click', async function (e) {
    if (e.target.classList.contains('boton-carrito')) {

        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'))
                           || JSON.parse(sessionStorage.getItem('usuarioActivo'));

        if (!usuarioActivo) {
            if (typeof mostrarModalAcceso === 'function') {
                mostrarModalAcceso('Debes iniciar sesión para agregar productos al carrito.', 'inicioSesion.html');
            } else {
                alert('Debes iniciar sesión para agregar productos al carrito.');
                window.location.href = 'inicioSesion.html';
            }
            return;
        }

        const idCarrito = usuarioActivo.idCarrito || usuarioActivo.idUsuario || usuarioActivo.id;
        const idProducto = e.target.getAttribute('data-id');

        if (!idProducto || idProducto === 'undefined') {
            console.error("No se pudo identificar el ID del producto.");
            return;
        }

        try {
            const res = await fetch(`${API_DETALLE_CARRITO_URL}/${idCarrito}/producto/${idProducto}?cantidad=1`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) throw new Error("Error al añadir el producto al carrito.");

            if (typeof actualizarBadgeNavegacion === 'function') {
                actualizarBadgeNavegacion();
            }

            alert('¡Producto agregado al carrito exitosamente!');

        } catch (error) {
            console.error("No se pudo agregar al carrito:", error);
            alert("Ocurrió un error al intentar agregar el producto.");
        }
    }
});

// Función dedicada exclusivamente a pintar el número en el Navbar
function actualizarBadgeNavegacion(forzarContador = null) {
    const divcarrito = document.querySelector('.cart-icon-wrapper');
    if (!divcarrito) return;

    let carrito = divcarrito.querySelector('.contador-carrito');
    if (!carrito) {
        carrito = document.createElement('P');
        carrito.classList.add('contador-carrito');
        divcarrito.append(carrito);
    }

    let contador = forzarContador !== null ? forzarContador : (parseInt(localStorage.getItem('contadorCarrito')) || 0);

    if (contador > 0) {
        carrito.style.display = 'block';
        if (contador >= 100) {
            carrito.innerHTML = `<span class="carrito-mas">+</span>99`;
        } else {
            carrito.textContent = contador;
        }
    } else {
        carrito.style.display = 'none';
    }
}