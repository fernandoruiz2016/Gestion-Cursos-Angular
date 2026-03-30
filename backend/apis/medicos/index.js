const express = require("express");
const router = express.Router();
const {validarMedico} = require("../../middleware/medicos/validacion")
const { obtenerMedicosController, obtenerMedicosPorIdController, crearMedicoController,actualizarMedicoController, eliminarMedicoController } = require("./medicos.controller")

// Obtener todos los medicos
router.get("/", obtenerMedicosController);

// Obtener un medico por ID
router.get("/:id", obtenerMedicosPorIdController);

// Crear un nuevo medico
router.post("/", validarMedico, crearMedicoController);

// Actualizar un medico
router.put("/:id", validarMedico, actualizarMedicoController);

// Eliminar un medico
router.delete("/:id", eliminarMedicoController);

module.exports = router;
