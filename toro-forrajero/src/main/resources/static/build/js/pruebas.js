document.addEventListener('DOMContentLoaded', function () {
    cargarProductos();
})
const itemsController = new ItemsController(0);

const API_URL = 'http://44.202.55.123:8080/api/productos';

async function cargarProductos() {

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error la optener Productos");
        const productos = await res.json();
        console.log(productos[0].nombreProducto);

        productos.forEach(producto => {
            itemsController.addItem(
                producto.nombreProducto,
                producto.descripcion,
                producto.destacado,
                producto.especie,
                producto.peso,
                producto.precio,
                producto.marca,
                producto.imagen,
                producto.estado
            )

        });
        renderizarHTML(itemsController.items);

    }
    catch (error) {
        console.error("No se pudo cargar el catálogo:", error);

    }


}


function renderizarHTML(items) {
    const catalogo = document.getElementById('catalogo-productos');
    if (!catalogo) return;

    // Inyectamos exactamente la maquetación en HTML que creó tu compañero
    catalogo.innerHTML = items.map(producto => `
        <article class="tarjeta-producto">
            <img src="${producto.imagen}" alt="${producto.nombreProducto}">

            <div class="contenido-producto">
                <h2>${producto.nombreProducto}</h2>
                <p>${producto.descripcion}</p>
                <span class="precio">$${producto.precio} MXN</span>
                <span class="visibilidad">
                Visibilidad: <span class="visibilidad--${producto.estado === 'activo' ? 'activo' : 'inactivo'}">${producto.estado}</span>
                </span>
                <div class="d-flex admin-btns">
                    <button 
                        type="button" 
                        class="boton-carrito" 
                        data-producto="${producto.nombreProducto}" 
                        data-precio="${producto.precio}">
                        Editar
                    </button>
                    <button 
                        type="button" 
                        class="boton-carrito" 
                        data-producto="${producto.nombreProducto}" 
                        data-precio="${producto.precio}">
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}




