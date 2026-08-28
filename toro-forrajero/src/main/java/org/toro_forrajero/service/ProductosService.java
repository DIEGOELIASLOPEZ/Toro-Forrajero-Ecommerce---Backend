package org.toro_forrajero.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.toro_forrajero.dto.ProductosRequestDTO;
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
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    @Override
    public Productos guardar(ProductosRequestDTO dto) {
        Productos producto = new Productos();

        producto.setNombre(dto.getNombre());
        producto.setMarca(dto.getMarca());
        producto.setEspecie(dto.getEspecie());
        producto.setStock(dto.getStock());
        producto.setCosto(dto.getCosto());
        producto.setPrecioVenta(dto.getPrecioVenta());
        producto.setVisibilidad(dto.getVisibilidad());
        producto.setDestacado(dto.getDestacado());
        producto.setDescripcion(dto.getDescripcion());

        // Asignación indispensable para la columna NOT NULL
        producto.setImagen(dto.getImagen());

        return productosRepository.save(producto);
    }

    @Override
    public Productos actualizar(Long id, ProductosRequestDTO dto) {
        Productos productoExistente = obtenerPorId(id);

        productoExistente.setNombre(dto.getNombre());
        productoExistente.setMarca(dto.getMarca());
        productoExistente.setEspecie(dto.getEspecie());
        productoExistente.setStock(dto.getStock());
        productoExistente.setCosto(dto.getCosto());
        productoExistente.setPrecioVenta(dto.getPrecioVenta());
        productoExistente.setVisibilidad(dto.getVisibilidad());
        productoExistente.setDestacado(dto.getDestacado());
        productoExistente.setDescripcion(dto.getDescripcion());

        // Actualización de la imagen
        productoExistente.setImagen(dto.getImagen());

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
        return productosRepository.findByMarcaIgnoreCaseAndEspecieIgnoreCase(marca, especie);
    }

//    @Override
//    public List<Productos> obtenerDestacados2() {
//        List<Productos> todos = productosRepository.findAll();
//
//        System.out.println("====== INICIO DIAGNÓSTICO DESTACADOS ======");
//        for (Productos p : todos) {
//            Object valDestacado = p.isDestacado(); // O p.getDestacado() según tu entidad
//            Object valVisibilidad = p.isVisibilidad(); // O p.getVisibilidad()
//
//            System.out.println("Producto ID: " + p.getIdProducto() + " | Nombre: " + p.getNombre());
//
//            System.out.println("  -> Valor Destacado: " + valDestacado
//                    + " | Tipo Java: " + (valDestacado != null ? valDestacado.getClass().getName() : "null"));
//
//            System.out.println("  -> Valor Visibilidad: " + valVisibilidad
//                    + " | Tipo Java: " + (valVisibilidad != null ? valVisibilidad.getClass().getName() : "null"));
//            System.out.println("---------------------------------------------");
//        }
//        System.out.println("====== FIN DIAGNÓSTICO DESTACADOS ======");
//
//        // Retornamos todos los productos de momento para no bloquear la prueba
//        return todos;
//    }

    @Override
    public List<Productos> obtenerDestacados() {
        return productosRepository.obtenerDestacados();
    }
}