package org.toro_forrajero.service;

import java.util.List;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.toro_forrajero.model.Productos;
import org.toro_forrajero.repository.ProductosRepository;


@Service
public class ProductosService implements IProductosService {

    private final ProductosRepository productosRepository;

    public ProductosService(ProductosRepository productosRepository) {
        this.productosRepository = productosRepository;
    }

    @Override
    public List<Productos> listarTodos() {
        return productosRepository.findAll();
    }

    @Override
    public Productos obtenerPorId(Long id) {
        return productosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Producto no encontrado con id: " + id));
    }

    @Override
    public Productos guardar(Productos producto) {
        return productosRepository.save(producto);
    }

    @Override
    public Productos actualizar(Long id, Productos producto) {

        Productos productoExistente = obtenerPorId(id);

        productoExistente.setNombre(producto.getNombre());
        productoExistente.setMarca(producto.getMarca());
        productoExistente.setEspecie(producto.getEspecie());
        productoExistente.setStock(producto.getStock());
        productoExistente.setCosto(producto.getCosto());
        productoExistente.setPrecioVenta(producto.getPrecioVenta());
        productoExistente.setVisibilidad(producto.getVisibilidad());
        productoExistente.setDestacado(producto.getDestacado());
        productoExistente.setDescripcion(producto.getDescripcion());

        return productosRepository.save(productoExistente);
    }

    @Override
    public void eliminar(Long id) {
        Productos producto = obtenerPorId(id);
        productosRepository.delete(producto);
    }

    @Override
    public List<Productos> buscarPorMarca(String marca) {
        return productosRepository.findByMarcaIgnoreCase(marca);
    }

    @Override
    public List<Productos> buscarPorEspecie(String especie) {
        return productosRepository.findByEspecieIgnoreCase(especie);
    }

    @Override
    public List<Productos> buscarPorMarcaYEspecie(String marca, String especie) {
        return productosRepository.findByMarcaIgnoreCaseAndEspecieIgnoreCase(
                marca,
                especie
        );
    }
}
