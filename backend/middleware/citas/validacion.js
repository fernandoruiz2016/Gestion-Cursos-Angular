function validarCita(req, res, next) {
    const { idPaciente, idMedico, estado, fecha, hora } = req.body;

    if (!idPaciente || !idMedico || !estado || !fecha || !hora) {
        return res.status(400).json({
            error: {
                message: "Todos los campos son obligatorios",
            },
        });
    }

    if (!Number.isInteger(idPaciente)) {
        return res.status(400).json({
            error: {
                message: "El idPaciente debe ser un número entero",
            },
        });
    }

    if (!Number.isInteger(idMedico)) {
        return res.status(400).json({
            error: {
                message: "El idMedico debe ser un número entero",
            },
        });
    }

    if (typeof estado !== "string") {
        return res.status(400).json({
            error: {
                message: "El estado debe ser un string",
            },
        });
    }

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fecha)) {
        return res.status(400).json({
            error: { message: "La fecha debe tener formato YYYY-MM-DD" }
        });
    }

    const regexHora = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regexHora.test(hora)) {
      return res.status(400).json({
        error: { message: "La hora debe tener formato HH:MM (24 horas)" },
      });
    }

    const fechaHora = new Date(`${fecha}T${hora}:00`);

    if (isNaN(fechaHora.getTime())) {
      return res.status(400).json({
        error: { message: "La fecha u hora no es válida" },
      });
    }

    const ahora = new Date();

    if (fechaHora <= ahora) {
      return res.status(400).json({
        error: { message: "No se puede registrar una cita en el pasado" },
      });
    }
    next();
}

module.exports = {
    validarCita: validarCita
}