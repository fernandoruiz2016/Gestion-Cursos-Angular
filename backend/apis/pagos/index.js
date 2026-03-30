const express = require("express");
const router = express.Router();
const {validarPago} = require("../../middleware/pagos/validacion")
const { obtenerPagosController, obtenerPagosPorIdController, crearPagoController,actualizarPagoController, eliminarPagoController } = require("./pagos.controller")

// Obtener todos los pagos
router.get("/", obtenerPagosController);

// Obtener un pago por ID
router.get("/:id", obtenerPagosPorIdController);

// Crear un nuevo pago
router.post("/", validarPago, crearPagoController);

// Actualizar un pago
router.put("/:id", validarPago, actualizarPagoController);

// Eliminar un pago
router.delete("/:id", eliminarPagoController);

module.exports = router;
