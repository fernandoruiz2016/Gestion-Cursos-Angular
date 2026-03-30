const {
  obtenerPagos,
  obtenerPagoPorId,
  crearPago,
  actualizarPago,
  eliminarPago,
} = require("./pagos.service");

async function obtenerPagosController(req, res) {
  try {
    const pagos = await obtenerPagos();
    res.status(200).json(pagos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las pagos" });
  }
}

async function obtenerPagosPorIdController(req, res) {
  try {
    const { id } = req.params;
    const pago = await obtenerPagoPorId(id);

    if (pago.error) {
      const { codigo, mensaje, estado } = pago.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado obteniendo pago:`, pago.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(200).json(pago);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la pago" });
  }
}

async function crearPagoController(req, res) {
  try {
    const { idCita, monto, metodoPago } = req.body;
    const pago = await crearPago(idCita, monto, metodoPago);

    if (pago.error) {
      const { codigo, mensaje, estado } = pago.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado creando pago:`, pago.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(201).json(pago);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la pago" });
  }
}

async function actualizarPagoController(req, res) {
  try {
    const { id } = req.params;
    const { idCita, monto, metodoPago } = req.body;
    const pago = await actualizarPago(
      idCita, 
      monto, 
      metodoPago,
      id,
    );

    if (pago.error) {
      const { codigo, mensaje, estado } = pago.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado actualizando pago:`, pago.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }

    res.status(200).json(pago);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la pago" });
  }
}

async function eliminarPagoController(req, res) {
  try {
    const { id } = req.params;
    const pago = await eliminarPago(id);

    if (pago.error) {
      const { codigo, mensaje, estado } = pago.error;
      const mensajeError = {
        error: {
          codigo: codigo,
          mensaje: mensaje,
        },
      };

      if (["001", "002"].includes(codigo)) {
        return res.status(estado).json(mensajeError);
      }

      console.error(`Error inesperado eliminando pago:`, pago.error);
      return res.status(500).json({
        error: {
          codigo: 500,
          mensaje: "Error de servidor",
        },
      });
    }
    res.status(200).json({ mensaje: "pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la pago" });
  }
}

module.exports = {
  obtenerPagosController: obtenerPagosController,
  obtenerPagosPorIdController: obtenerPagosPorIdController,
  crearPagoController: crearPagoController,
  actualizarPagoController: actualizarPagoController,
  eliminarPagoController: eliminarPagoController
};
