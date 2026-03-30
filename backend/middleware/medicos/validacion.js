function validarMedico(req, res, next) {
    const { apellido, nombre, dni, telefono, idEspecialidad } = req.body;

    if (!apellido || !nombre || !dni || !telefono || !idEspecialidad) {
      return res.status(400).json({
        error: {
          message: "Todos los campos son obligatorios",
        },
      });
    }

        if (typeof apellido !== "string") {
        return res.status(400).json({
            error: {
                message: "El apellido debe ser un string",
            },
        });
    }

    if (typeof nombre !== "string") {
        return res.status(400).json({
            error: {
                message: "El nombre debe ser un string",
            },
        });
    }

    if (typeof dni !== "string") {
        return res.status(400).json({
            error: {
                message: "El dni debe ser un string",
            },
        });
    }

    if (typeof telefono !== "string") {
        return res.status(400).json({
            error: {
                message: "El telefono debe ser un string",
            },
        });
    }

    if (!Number.isInteger(idEspecialidad)) {
        return res.status(400).json({
            error: {
                message: "La especialidad debe ser un número entero",
            },
        });
    }

    next();
}

module.exports = {
    validarMedico: validarMedico
}