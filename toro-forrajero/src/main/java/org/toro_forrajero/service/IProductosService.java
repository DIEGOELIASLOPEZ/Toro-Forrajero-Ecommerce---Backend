package org.toro_forrajero.service;

import java.util.List;

import org.toro_forrajero.dto.ProductosRequestDTO;
import org.toro_forrajero.model.Productos;

public interface IProductosService {

    List<Productos> listarTodos();

    Productos obtenerPorId(Long id);

    Productos guardar(ProductosRequestDTO dto);

    Productos actualizar(Long id, ProductosRequestDTO dto);

    void eliminar(Long id);

    List<Productos> buscarPorMarca(String marca);

    List<Productos> buscarPorEspecie(String especie);

    List<Productos> buscarPorMarcaYEspecie(String marca, String especie);

    List<Productos> obtenerDestacados();

}
