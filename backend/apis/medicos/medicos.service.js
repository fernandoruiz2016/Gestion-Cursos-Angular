const { obtenerMedicosRepository, obtenerMedicoPorIdRepository, crearMedicoRepository, actualizarMedicoRepository, eliminarMedicoRepository } = require("./medicos.repository")

async function obtenerMedicos() {
    return await obtenerMedicosRepository();
}

async function obtenerMedicoPorId(id) {
    const medico = await obtenerMedicoPorIdRepository(id);

    if (medico.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return medico[0];
}

async function crearMedico(apellido, nombre, dni, telefono, idEspecialidad) {
    const medico = await crearMedicoRepository(apellido, nombre, dni, telefono, idEspecialidad);

    if (medico.length === 0) {
        return {
            error: {
                code: "002",
                mensaje: "No se pudo crear el medico",
                estado: 500,
            },
        };
    }

    return medico[0];
}

async function actualizarMedico(apellido, nombre, dni, telefono, idEspecialidad, id) {
    const medico = await actualizarMedicoRepository(apellido, nombre, dni, telefono, idEspecialidad, id);

    if (medico.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return medico[0];
}

async function eliminarMedico(id) {
    const medico = await eliminarMedicoRepository(id);

    if (medico.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return medico[0];
}

module.exports = {
    obtenerMedicos: obtenerMedicos,
    obtenerMedicoPorId: obtenerMedicoPorId,
    crearMedico: crearMedico,
    actualizarMedico: actualizarMedico,
    eliminarMedico: eliminarMedico,
};