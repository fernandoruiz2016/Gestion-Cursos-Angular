function validarPaciente(req, res, next) {
    const { apellido, nombre, dni, telefono } = req.body;

    if (!apellido || !nombre || !dni || !telefono) {
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

    next();
}

module.exports = {
    validarPaciente: validarPaciente
}