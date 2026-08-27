// Script Split Text (animación de letras del hero)

function splitText(element, delayStep = 0.04) {
    const nodes = Array.from(element.childNodes);
    element.innerHTML = "";
    let index = 0;

    nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Normaliza saltos de línea, tabs e indentación a un solo espacio
            const cleanText = node.textContent.replace(/\s+/g, " ").trim();
            if (cleanText.length === 0) return;

            const words = cleanText.split(" ");

            words.forEach((word, wIdx) => {
                if (word.length > 0) {
                    // Cada palabra se agrupa en un bloque indivisible
                    // para que el navegador nunca corte a mitad de palabra
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

                // Espacio entre palabras (aquí sí puede cortar el navegador)
                if (wIdx < words.length - 1) {
                    const spaceSpan = document.createElement("span");
                    spaceSpan.className = "split-space";
                    spaceSpan.innerHTML = "&nbsp;";
                    element.appendChild(spaceSpan);
                }
            });
        } else {
            // Mantiene elementos como <br> tal cual
            element.appendChild(node.cloneNode(true));
        }
    });
}


const itemsController = new ItemsController(0);
const API_URL = 'http://44.202.55.123:8080/api/productos';


document.addEventListener("DOMContentLoaded", () => {
    const heroTitle = document.getElementById("hero-title");
    if (heroTitle) splitText(heroTitle);

    cargarProductos();
});

async function cargarProductos() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener Productos");
        const productos = await res.json();

        // 1. Limpiamos la lista local
        itemsController.items = [];

        // 2. Filtramos solo los productos cuyo estado sea "destacado": "activo"
        const productosDestacados = productos.filter(producto => 
            String(producto.destacado).trim().toLowerCase() === 'activo'
        );



        // 3. Agregamos al controlador únicamente los productos activos
        productosDestacados.forEach(producto => {
            itemsController.addItem(
                producto.id,
                producto.nombreProducto,
                producto.descripcion,
                producto.destacado,
                producto.especie,
                producto.peso,
                producto.precio,
                producto.marca,
                producto.imagen,
                producto.estado
            );
        });

        // 4. Actualizamos el catálogo con los elementos ya filtrados
        actualizarCatalogoYEventos(itemsController.items);

    } catch (error) {
        console.error("No se pudo cargar el catálogo ):", error);
    }
}

function actualizarCatalogoYEventos(items) {
	renderizarHTML(items);
    actualizarBadgeNavegacion();
}

//Función auxiliar para actualizar el DOM y reactivar los escuchadores del carrito
function renderizarHTML(items) {
	const catalogo = document.getElementById('catalogo-productos');
	if (!catalogo) return;

    //En el caso en que no haya productos destacados
    if (!items || items.length === 0) {
        catalogo.innerHTML = `<p class="sin-productos">No hay productos destacados disponibles.</p>`;
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
                        data-producto="${producto.nombreProducto}" 
                        data-precio="${producto.precio}">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// document.addEventListener("DOMContentLoaded", () => {
// 	cargarProductos();
// 	renderizarHTML(itemsController.items);
// });




/* ====================================================
    NUEVO MOTOR DEL CARRITO (DELEGACIÓN DE EVENTOS)
   ==================================================== */

// 1. Vigilante global para los clics en cualquier botón de carrito
document.addEventListener('click', function(e) {
    // Si el elemento clickeado tiene la clase 'boton-carrito'
    if (e.target.classList.contains('boton-carrito')) {
        const btn = e.target;
        const nombreExacto = btn.getAttribute('data-producto');
        
        // Buscar el producto en nuestro catálogo
        const productoSeleccionado = itemsController.items.find(
            producto => String(producto.nombreProducto).trim() === String(nombreExacto).trim()
        );

        if (productoSeleccionado) {
            // --- A) GUARDAR EL PRODUCTO EN LOCALSTORAGE ---
            let carritoProductos = [];
            try {
                carritoProductos = JSON.parse(localStorage.getItem('carrito')) || [];
            } catch(error) {
                carritoProductos = []; // Si había un error previo en la memoria, empezamos de cero
            }
            
            carritoProductos.push(productoSeleccionado);
            localStorage.setItem('carrito', JSON.stringify(carritoProductos));

            // --- B) ACTUALIZAR EL NÚMERO DEL CONTADOR ---
            let contador = parseInt(localStorage.getItem('contadorCarrito')) || 0;
            contador++;
            localStorage.setItem('contadorCarrito', contador);

            // --- C) REFLEJAR EL CAMBIO EN LA INTERFAZ ---
            actualizarBadgeNavegacion(contador);
        }
    }
});

// 2. Función dedicada exclusivamente a pintar el número en el Navbar
function actualizarBadgeNavegacion(forzarContador = null) {
    const divcarrito = document.querySelector('.cart-icon-wrapper');
    if (!divcarrito) return; // Si no hay carrito en esta página, no hacemos nada

    let carrito = divcarrito.querySelector('.contador-carrito');
    if (!carrito) {
        carrito = document.createElement('P');
        carrito.classList.add('contador-carrito');
        divcarrito.append(carrito);
    }

    // Tomamos el contador forzado (si venimos de un clic) o leemos la memoria
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