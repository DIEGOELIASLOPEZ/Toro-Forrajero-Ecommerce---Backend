// itemsController.js
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