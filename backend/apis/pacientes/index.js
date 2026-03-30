const express = require("express");
const router = express.Router();
const {validarPaciente} = require("../../middleware/pacientes/validacion")
const { obtenerPacientesController, obtenerPacientesPorIdController, crearPacienteController,actualizarPacienteController, eliminarPacienteController } = require("./pacientes.controller")

// Obtener todos los pacientes
router.get("/", obtenerPacientesController);

// Obtener un paciente por ID
router.get("/:id", obtenerPacientesPorIdController);

// Crear un nuevo paciente
router.post("/", validarPaciente, crearPacienteController);

// Actualizar un paciente
router.put("/:id", validarPaciente, actualizarPacienteController);

// Eliminar un paciente
router.delete("/:id", eliminarPacienteController);

module.exports = router;
