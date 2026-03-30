const {
  obtenerCitas,
  obtenerCitaPorId,
  crearCita,
  actualizarCita,
  eliminarCita,
  obtenerCitasDelDiaService,
  obtenerCitasFiltradasService,
} = require("./citas.service");

async function obtenerCitasController(req, res) {
  try {
    const citas = await obtenerCitas();
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
}

async function obtenerCitasPorIdController(req, res) {
  try {
    const { id } = req.params;
    const cita = await obtenerCitaPorId(id);

    if (cita && cita.error) {
      // ... tu lógica de manejo de errores 001, 002
      return res.status(cita.error.estado).json({ error: cita.error });
    }

    res.status(200).json(cita);
  } catch (error) {
    console.error("--- ERROR REAL EN EL BACKEND ---");
    console.error(error);
    res.status(500).json({ error: "Error interno", detalle: error.message });
  }
}

async function crearCitaController(req, res) {
  try {
    // 1. Extraemos TODOS los campos que vienen del Frontend (incluyendo monto y metodoPago)
    const { idPaciente, idMedico, estado, fecha, hora, monto, metodoPago } =
      req.body;

    // 2. Pasamos un ÚNICO objeto con todos los datos al Service/Repository
    // Esto coincide con el cambio que hicimos en el Repository anteriormente
    const cita = await crearCita({
      idPaciente,
      idMedico,
      estado,
      fecha,
      hora,
      monto,
      metodoPago,
    });

    // 3. Manejo de errores específicos (tu lógica actual)
    if (cita.error) {
      const { code, mensaje, estado: estadoError } = cita.error;
      const mensajeError = {
        error: {
          codigo: code,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(code)) {
        return res.status(estadoError).json(mensajeError);
      }

      console.error(`Error inesperado creando cita:`, cita.error);
      return res.status(500).json({
        error: { codigo: 500, mensaje: "Error de servidor" },
      });
    }

    // 4. Si todo salió bien, respondemos con la cita creada
    res.status(201).json(cita);
  } catch (error) {
    console.error("Error en crearCitaController:", error);
    res.status(500).json({ error: "Error al crear la cita y el pago" });
  }
}

async function actualizarCitaController(req, res) {
  try {
    const { id } = req.params; // El ID que viene en la URL /api/citas/15
    const { idPaciente, idMedico, estado, fecha, hora, monto, metodoPago } = req.body;

    // Llamamos al service pasando el ID y el objeto consolidado
    const cita = await actualizarCita(id, {
      idPaciente,
      idMedico,
      estado,
      fecha,
      hora,
      monto,
      metodoPago
    });

    if (cita.error) {
      const { code, mensaje, estado: estadoError } = cita.error;
      return res.status(estadoError).json({
        error: { codigo: code, mensaje }
      });
    }

    res.status(200).json(cita);
  } catch (error) {
    console.error("Error en actualizarCitaController:", error);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
}

async function eliminarCitaController(req, res) {
  try {
    const { id } = req.params;
    const cita = await eliminarCita(id);

    if (cita.error) {
      const { codigo, mensaje, estado } = cita.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(cita.error.code)) {
        return res.status(cita.error.estado).json({
          error: {
            codigo: cita.error.code,
            mensaje: cita.error.mensaje,
          },
        });
      }

      console.error(`Error inesperado eliminando cita:`, cita.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }
    res.status(200).json({ mensaje: "cita eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la cita" });
  }
}

async function obtenerCitasDelDiaController(req, res) {
  try {
    const data = await obtenerCitasDelDiaService();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas del día" });
  }
}

async function obtenerCitasFiltradasController(req, res) {
  try {
    const { dni, fecha, estado, paciente, medico, especialidad, pago, idPaciente } = req.query;

    const citas = await obtenerCitasFiltradasService({
      dni,
      fecha,
      estado,
      paciente,
      medico, 
      especialidad, 
      pago,
      idPaciente
    });

    if (citas.length === 0) {
      return res.status(200).json([]);
    }

    res.json(citas);
  } catch (error) {
    console.error("Error en getCitasFiltradas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  obtenerCitasController: obtenerCitasController,
  obtenerCitasPorIdController: obtenerCitasPorIdController,
  crearCitaController: crearCitaController,
  actualizarCitaController: actualizarCitaController,
  eliminarCitaController: eliminarCitaController,
  obtenerCitasDelDiaController: obtenerCitasDelDiaController,
  obtenerCitasFiltradasController: obtenerCitasFiltradasController,
};
