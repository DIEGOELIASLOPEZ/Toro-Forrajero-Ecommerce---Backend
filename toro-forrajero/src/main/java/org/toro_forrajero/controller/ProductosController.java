package org.toro_forrajero.controller;

import org.toro_forrajero.dto.ProductosRequestDTO;
import org.toro_forrajero.model.Productos;
import org.toro_forrajero.service.IProductosService;
import org.toro_forrajero.service.ProductosService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/productos")
public class ProductosController {

    private final IProductosService productosService;

    //Constructor
    public ProductosController(ProductosService productosService){
        this.productosService = productosService;
    }

    @GetMapping
    public List<Productos> listarTodos(){
        return productosService.listarTodos();
    }

    @GetMapping("/{id}")
    public Productos obtenerPorId(@PathVariable Long id){
        return productosService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Productos guardar(@RequestBody ProductosRequestDTO dto){
        return productosService.guardar(dto);
    }

    @PutMapping("/{id}")
    public Productos actualizar(@PathVariable Long id, @RequestBody ProductosRequestDTO dto){
        return productosService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id){
        productosService.eliminar(id);
    }

    @GetMapping("/buscar")
    public List<Productos> buscar(@RequestParam(required = false) String marca, @RequestParam(required = false) String especie){
        if(marca != null && especie != null){
            return productosService.buscarPorMarcaYEspecie(marca, especie);
        } else if (marca != null){
            return productosService.buscarPorMarca(marca);
        } else if (especie != null){
            return productosService.buscarPorEspecie(especie);
        }

        return productosService.listarTodos();
    }
}

