function validarPago(req, res, next) {
  const { idCita, monto, metodoPago } = req.body;

  if (!idCita || monto === undefined || !metodoPago) {
    return res.status(400).json({
      error: {
        message: "El idCita, el monto y el método de pago son obligatorios",
      },
    });
  }

  if (!Number.isInteger(idCita)) {
    return res.status(400).json({
      error: {
        message: "El idCita debe ser un número entero",
      },
    });
  }

  if (typeof monto !== "number" || monto < 0) {
    return res.status(400).json({
      error: {
        message: "El monto debe ser un número válido y no puede ser negativo",
      },
    });
  }

  // 4. Validar Método de Pago (comparar con los permitidos en el CHECK del SQL)
  const metodosPermitidos = ["Efectivo", "Tarjeta", "Transferencia"];
  if (!metodosPermitidos.includes(metodoPago)) {
    return res.status(400).json({
      error: {
        message: `El método de pago debe ser uno de los siguientes: ${metodosPermitidos.join(", ")}`,
      },
    });
  }

  next();
}

module.exports = {
  validarPago: validarPago,
};
