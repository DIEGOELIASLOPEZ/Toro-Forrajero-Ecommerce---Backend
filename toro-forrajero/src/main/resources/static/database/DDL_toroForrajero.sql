
-- MySQL Workbench Forward Engineering Corregido (Nombres en minúsculas + Sin relación Pedido-Dirección)

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema toro_forrajero_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `toro_forrajero_db` DEFAULT CHARACTER SET utf8mb4 ;
USE `toro_forrajero_db` ;

-- -----------------------------------------------------
-- Limpieza de tablas previas si existen
-- -----------------------------------------------------
DROP TABLE IF EXISTS `toro_forrajero_db`.`detalle_carrito` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`carrito` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`detalle_pedido` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`pedido` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`direccion` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`metodo_pago` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`productos` ;
DROP TABLE IF EXISTS `toro_forrajero_db`.`usuario` ;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(30) NOT NULL,
  `apellido` VARCHAR(40) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `area_interes` VARCHAR(20) NOT NULL,
  `correo` VARCHAR(50) NOT NULL,
  `estado` VARCHAR(30) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `rol` ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`productos` (
  `id_producto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `marca` VARCHAR(30) NOT NULL,
  `especie` VARCHAR(20) NOT NULL,
  `stock` INT NOT NULL,
  `costo` DECIMAL(12,2) NOT NULL,
  `precio_venta` DECIMAL(12,2) NOT NULL,
  `visibilidad` TINYINT NOT NULL DEFAULT 1,
  `destacado` TINYINT NOT NULL DEFAULT 0,
  `descripcion` TEXT NOT NULL,
  PRIMARY KEY (`id_producto`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`metodo_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`metodo_pago` (
  `id_metodo_pago` INT NOT NULL AUTO_INCREMENT,
  `num_tarjeta` VARCHAR(100) NOT NULL,
  `fecha_expiracion` VARCHAR(7) NOT NULL,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_metodo_pago`),
  INDEX `fk_metodo_pago_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_metodo_pago_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `toro_forrajero_db`.`usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`direccion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`direccion` (
  `id_direccion` INT NOT NULL AUTO_INCREMENT,
  `calle` VARCHAR(45) NOT NULL,
  `num_exterior` VARCHAR(45) NOT NULL,
  `num_interior` VARCHAR(45) NULL,
  `codigo_postal` VARCHAR(10) NOT NULL,
  `alcaldia` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `tel` VARCHAR(10) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_direccion`), 
  INDEX `fk_direccion_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_direccion_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `toro_forrajero_db`.`usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`carrito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`carrito` (
  `id_carrito` INT NOT NULL AUTO_INCREMENT,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_carrito`),
  INDEX `fk_carrito_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_carrito_usuario1`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `toro_forrajero_db`.`usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`detalle_carrito`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`detalle_carrito` (
  `id_carrito` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `cantidad` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_carrito`, `id_producto`),
  INDEX `fk_detalle_carrito_productos1_idx` (`id_producto` ASC) VISIBLE,
  INDEX `fk_detalle_carrito_carrito1_idx` (`id_carrito` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_carrito_carrito1`
    FOREIGN KEY (`id_carrito`)
    REFERENCES `toro_forrajero_db`.`carrito` (`id_carrito`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_detalle_carrito_productos1`
    FOREIGN KEY (`id_producto`)
    REFERENCES `toro_forrajero_db`.`productos` (`id_producto`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`pedido` (
  `id_pedido` INT NOT NULL AUTO_INCREMENT,
  `fecha_pedido` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_entrega` DATETIME NULL,
  `monto_total` DECIMAL(12,2) NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  `id_usuario` INT NOT NULL,
  `id_metodo_pago` INT NOT NULL,
  PRIMARY KEY (`id_pedido`),
  INDEX `fk_pedido_usuario1_idx` (`id_usuario` ASC) VISIBLE,
  INDEX `fk_pedido_metodo_pago1_idx` (`id_metodo_pago` ASC) VISIBLE,
  CONSTRAINT `fk_pedido_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `toro_forrajero_db`.`usuario` (`id_usuario`),
  CONSTRAINT `fk_pedido_metodo_pago`
    FOREIGN KEY (`id_metodo_pago`)
    REFERENCES `toro_forrajero_db`.`metodo_pago` (`id_metodo_pago`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `toro_forrajero_db`.`detalle_pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `toro_forrajero_db`.`detalle_pedido` (
  `id_pedido` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(12,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (`id_pedido`, `id_producto`),
  INDEX `fk_detalle_pedido_productos1_idx` (`id_producto` ASC) VISIBLE,
  INDEX `fk_detalle_pedido_pedido1_idx` (`id_pedido` ASC) VISIBLE,
  CONSTRAINT `fk_detalle_pedido_pedido1`
    FOREIGN KEY (`id_pedido`)
    REFERENCES `toro_forrajero_db`.`pedido` (`id_pedido`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_pedido_productos1`
    FOREIGN KEY (`id_producto`)
    REFERENCES `toro_forrajero_db`.`productos` (`id_producto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;