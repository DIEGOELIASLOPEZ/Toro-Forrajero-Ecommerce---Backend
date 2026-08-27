//temporal si no se ocupa lo borras
/* document.addEventListener("DOMContentLoaded", function () {

    // Seleccionamos todos los botones de categorías.
    const botonesCategorias = document.querySelectorAll(".boton-categoria");

    // Seleccionamos los cuatro catálogos.
    const catalogos = document.querySelectorAll(".catalogo-productos");

    botonesCategorias.forEach(function (boton) {

        boton.addEventListener("click", function () {

            // Obtenemos el nombre de la categoría seleccionada.
            const categoriaSeleccionada = boton.dataset.categoria;

            // Quitamos la clase activo de todos los botones.
            botonesCategorias.forEach(function (botonActual) {
                botonActual.classList.remove("activo");
            });

            // Agregamos activo solamente al botón seleccionado.
            boton.classList.add("activo");

            // Ocultamos todos los catálogos.
            catalogos.forEach(function (catalogo) {
                catalogo.classList.remove("activo");
            });

            // Buscamos el catálogo cuyo id corresponde al botón.
            const catalogoSeleccionado =
                document.getElementById(categoriaSeleccionada);

            // Mostramos el catálogo seleccionado.
            if (catalogoSeleccionado) {
                catalogoSeleccionado.classList.add("activo");
            }
        });
    });

}); */
//si no hay nada borra todo lo de arriba


