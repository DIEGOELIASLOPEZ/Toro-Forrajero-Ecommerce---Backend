package org.toro_forrajero.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.toro_forrajero.model.Productos;

@Repository
public interface ProductosRepository extends JpaRepository<Productos, Long>{
    //Mostrar productos por marca
    List<Productos> findByMarcaIgnoreCase(String marca);

    //Mostrar productos por especie
    List<Productos> findByEspecieIgnoreCase(String especie);

    //Mostrar productos por marca && especie - a ver si funciona
    List<Productos> findByMarcaIgnoreCaseAndEspecieIgnoreCase(
            String marca,
            String especie
    );
}
