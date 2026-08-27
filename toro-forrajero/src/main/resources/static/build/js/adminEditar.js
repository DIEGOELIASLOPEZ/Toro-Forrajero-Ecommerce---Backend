const API_URL = 'http://localhost:8080/api/productos';

// ==========================================
// 1. INICIALIZACIÓN Y EVENTOS DE INTERFAZ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const idProducto = localStorage.getItem('idProductoEditar');
    console.log("ID recuperado de localStorage:", idProducto);

    if (idProducto) {
        cargarProducto(idProducto);
    } else {
        console.warn("No hay ningún ID de producto guardado en el localStorage.");
    }

    const inputImagen = document.getElementById('imagen-principal');
    const btnPreview = document.getElementById('btn-preview');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const imgPreviewTarget = document.getElementById('img-preview-target');
    const nombreArchivo = document.getElementById('nombre-archivo');
    const btnEliminar = document.getElementById('btn-eliminar');
    const errorImagenDiv = document.getElementById('error-imagen');

    const checkVisibilidad = document.getElementById('check-visibilidad');
    const estadoTexto = document.querySelector('.estado-texto');
    const checkDestacado = document.getElementById('check-destacado');
    const textoDestacado = document.querySelector('#texto-destacado');

    const modalElement = document.getElementById('modalImagen');
    if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement, {
            keyboard: true,
            backdrop: true
        });

        btnPreview?.addEventListener('click', () => myModal.show());
        btnCerrarModal?.addEventListener('click', () => myModal.hide());
    }

    inputImagen?.addEventListener('change', async (e) => {
        const error = validarImagen(inputImagen);

        if (error) {
            if (errorImagenDiv) errorImagenDiv.innerHTML = error;
            inputImagen.value = '';
            return;
        }

        if (errorImagenDiv) errorImagenDiv.innerHTML = '';

        const file = e.target.files[0];
        if (file) {
            if (nombreArchivo) nombreArchivo.textContent = file.name;

            const base64String = await obtenerBase64(file);
            if (imgPreviewTarget) {
                imgPreviewTarget.src = base64String;
            }
        }
    });

    btnEliminar?.addEventListener('click', () => {
        if (inputImagen) inputImagen.value = '';
        if (nombreArchivo) nombreArchivo.textContent = 'Sin archivo seleccionado';
        if (imgPreviewTarget) imgPreviewTarget.src = 'recursos-graficos/productos/default/default.png';
        if (errorImagenDiv) errorImagenDiv.innerHTML = '';
    });

    checkVisibilidad?.addEventListener('change', (e) => {
        if (estadoTexto) {
            estadoTexto.textContent = e.target.checked ? 'Activo' : 'Inactivo';
        }
    });

    checkDestacado?.addEventListener('change', (e) => {
        if (textoDestacado) {
            textoDestacado.textContent = e.target.checked ? 'SÍ' : 'NO';
        }
    });

    const btnGuardar = document.querySelector('.btn-custom-save');
    const formulario = document.querySelector('#formulario-adminEditar');

    btnGuardar?.addEventListener('click', (e) => {
        e.preventDefault();
        guardarCambios();
    });

    formulario?.addEventListener('submit', (e) => {
        e.preventDefault();
        guardarCambios();
    });
});

// ==========================================
// 2. PETICIÓN GET / CARGAR PRODUCTO (SPRING BOOT)
// ==========================================
async function cargarProducto(id) {
    const URL = `${API_URL}/${id}`;
    console.log("Haciendo petición GET a:", URL);

    try {
        const res = await fetch(URL);
        if (!res.ok) {
            throw new Error(`Error en el servidor: ${res.status} ${res.statusText}`);
        }

        const producto = await res.json();
        console.log("Datos recibidos de la API para editar:", producto);

        editarHTML(producto);

    } catch (error) {
        console.error("Fallo al cargar el producto:", error);
    }
}

function editarHTML(producto) {
    const h1 = document.querySelector('#product-title');
    const inputNombre = document.querySelector('#nombre-producto');
    const inputEspecie = document.querySelector('#especie');
    const inputMarca = document.querySelector('#marca');

    const costo = document.querySelector('#costo');
    const precio = document.querySelector('#precioVenta');
    const existencia = document.querySelector('#existencia');

    const descripcion = document.querySelector('#descripcion-producto');
    const imagen = document.querySelector('#nombre-archivo');
    const imagenVistaPrevia = document.querySelector('#img-preview-target');

    const visibilidad = document.querySelector('#check-visibilidad');
    const estadoTexto = document.querySelector('.estado-texto');

    const destacado = document.querySelector('#check-destacado');
    const textoDestacado = document.querySelector('#texto-destacado');

    const nombreProd = producto.nombre || producto.nombreProducto || '';
    const precioProd = producto.precioVenta !== undefined ? producto.precioVenta : producto.precio;
    const existenciaProd = producto.stock !== undefined ? producto.stock : producto.existencia;
    const estadoProd = producto.visibilidad !== undefined ? producto.visibilidad : producto.estado;

    if (h1) h1.textContent = nombreProd;
    if (inputNombre) inputNombre.value = nombreProd;

    // Selección segura del select de Especie
    if (inputEspecie && producto.especie) {
        const especieBuscada = String(producto.especie).trim().toLowerCase();
        let encontrada = false;

        for (let option of inputEspecie.options) {
            if (option.value.toLowerCase() === especieBuscada || option.text.toLowerCase() === especieBuscada) {
                inputEspecie.value = option.value;
                encontrada = true;
                break;
            }
        }
        if (!encontrada) {
            inputEspecie.value = producto.especie;
        }
    }

    if (inputMarca) inputMarca.value = producto.marca || '';

    if (costo) costo.value = producto.costo || 0;
    if (precio) precio.value = precioProd || 0;
    if (existencia)enciaVal = existenciaProd || 0;
    if (existencia) existencia.value = existenciaProd || 0;

    if (imagen) imagen.textContent = obtenerNombreImagenRegex(producto.imagen);
    if (imagenVistaPrevia) imagenVistaPrevia.src = producto.imagen || '';
    if (descripcion) descripcion.value = producto.descripcion || '';

    if (visibilidad) {
        const estaActivo = estadoProd === 'activo' || estadoProd === true;
        visibilidad.checked = estaActivo;
        if (estadoTexto) estadoTexto.textContent = estaActivo ? 'Activo' : 'Inactivo';
    }

    if (destacado) {
        const esDestacado = producto.destacado === 'activo' || producto.destacado === true || producto.destacado === 'si';
        destacado.checked = esDestacado;
        if (textoDestacado) textoDestacado.textContent = esDestacado ? 'SÍ' : 'NO';
    }
}

function obtenerNombreImagenRegex(path) {
    if (!path) return '';
    const match = path.match(/\/([^\/]+\.png)$/i);
    return match ? match[1] : path.split('/').pop();
}

// ==========================================
// 3. PETICIÓN PUT / ACTUALIZAR PRODUCTO (SPRING BOOT)
// ==========================================
async function guardarCambios() {
    mostrarModal();
    const id = localStorage.getItem('idProductoEditar');

    const inputImagen = document.querySelector('#imagen-principal');
    const imagenActual = document.querySelector('#img-preview-target')?.src || '';

    let rutaImagen = imagenActual;

    if (inputImagen && inputImagen.files.length > 0) {
        rutaImagen = await obtenerBase64(inputImagen.files[0]);
    }

    const productoDTO = {
        nombre: document.querySelector('#nombre-producto')?.value.trim() || '',
        especie: document.querySelector('#especie')?.value || '',
        marca: document.querySelector('#marca')?.value || '',
        costo: parseFloat(document.querySelector('#costo')?.value) || 0,
        precioVenta: parseFloat(document.querySelector('#precioVenta')?.value) || 0,
        stock: parseInt(document.querySelector('#existencia')?.value, 10) || 0,
        descripcion: document.querySelector('#descripcion-producto')?.value.trim() || '',
        imagen: rutaImagen,
        visibilidad: document.querySelector('#check-visibilidad')?.checked ? true : false,
        destacado: document.querySelector('#check-destacado')?.checked ? true : false
    };

    const URL = `${API_URL}/${id}`;

    try {
        const res = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoDTO)
        });

        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);

        const productoActualizado = await res.json();
        console.log("Producto actualizado con éxito:", productoActualizado);

        cerrarModal();
        window.location.href = 'adminHome.html';

    } catch (error) {
        console.error("Error en la petición PUT:", error);
        alert("Hubo un fallo al intentar guardar los cambios.");
        cerrarModal();
    }
}

// ==========================================
// 4. FUNCIONES AUXILIARES Y MODAL CARGA
// ==========================================
function validarImagen(inputImagen) {
    if (!inputImagen) return "No se encuentra el campo de la imagen";

    const archivos = inputImagen.files;
    const alertMensaje = `<span class="alerta-titulo naranja-text">Imagen principal:</span>`;

    if (!archivos || archivos.length === 0) {
        return `${alertMensaje} <span class="naranja-text">Debes seleccionar una imagen.</span>`;
    }

    const archivo = archivos[0];
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxTamanoBytes = 50 * 1024 * 1024;

    if (!tiposPermitidos.includes(archivo.type.toLowerCase())) {
        return `${alertMensaje} <span class="naranja-text">Formato no válido. Solo JPG, PNG y WEBP.</span>`;
    }

    if (archivo.size > maxTamanoBytes) {
        return `${alertMensaje} <span class="naranja-text">El archivo supera el tamaño máximo permitido (50MB).</span>`;
    }

    return undefined;
}

function obtenerBase64(imagen) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imagen);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function mostrarModal() {
    const modal = document.createElement('DIV');
    const carga = document.createElement('DIV');
    carga.innerHTML = `
        <div class="contenedor-loader">
            <img class="animacion-carga" src="recursos-graficos/formulario-contactanos/Forrajero-naranja.png" alt="Cargando">
        </div>`;
    modal.classList.add('modal-overlay');

    const body = document.querySelector('body');
    body.classList.add('overflow-hiden');
    body.appendChild(modal);
    modal.appendChild(carga);

    setTimeout(() => {
        modal.classList.add('is-visible');
    }, 10);
}

function cerrarModal() {
    const modal = document.querySelector('.modal-overlay');
    const body = document.querySelector('body');

    if (modal) {
        modal.classList.remove('is-visible');
        body.classList.remove('overflow-hiden');

        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}