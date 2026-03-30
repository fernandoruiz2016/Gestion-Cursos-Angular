const { obtenerMedicos, obtenerMedicoPorId, crearMedico, actualizarMedico, eliminarMedico } = require("./medicos.service");

async function obtenerMedicosController(req, res) {
  try {
    const medicos = await obtenerMedicos();
    res.status(200).json(medicos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los medicos" });
  }
}

async function obtenerMedicosPorIdController(req, res) {
  try {
    const { id } = req.params;
    const medico = await obtenerMedicoPorId(id);

    if (medico.error) {
      const { codigo, mensaje, estado } = medico.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado obteniendo medico:`, medico.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el medico" });
  }
}

async function crearMedicoController(req, res) {
  try {
    const { apellido, nombre, dni, telefono, idEspecialidad } = req.body;
    const medico = await crearMedico(apellido, nombre, dni, telefono, idEspecialidad);

    if (medico.error) {
      const { codigo, mensaje, estado } = medico.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado creando medico:`, medico.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(201).json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el medico" });
  }
}

async function actualizarMedicoController(req, res) {
  try {
    const { id } = req.params;
    const { apellido, nombre, dni, telefono, idEspecialidad } = req.body;
    const medico = await actualizarMedico(apellido, nombre, dni, telefono, idEspecialidad, id)

    if (medico.error) {
      const { codigo, mensaje, estado } = medico.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado actualizando medico:`, medico.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(200).json(medico);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el medico" });
  }
}

async function eliminarMedicoController(req, res) {
  try {
    const { id } = req.params;
    const medico = await eliminarMedico(id);

    if (medico.error) {
      const { codigo, mensaje, estado } = medico.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado eliminando medico:`, medico.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }
    res.status(200).json({ mensaje: "medico eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el medico" });
  }
}

module.exports = {
  obtenerMedicosController: obtenerMedicosController,
  obtenerMedicosPorIdController: obtenerMedicosPorIdController,
  crearMedicoController: crearMedicoController,
  actualizarMedicoController: actualizarMedicoController,
  eliminarMedicoController: eliminarMedicoController,
};
