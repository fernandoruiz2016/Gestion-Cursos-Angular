const { obtenerPacientesRepository, obtenerPacientePorIdRepository, crearPacienteRepository, actualizarPacienteRepository, eliminarPacienteRepository, obtenerPacientesFiltradosRepository } = require("./pacientes.repository")

async function obtenerPacientes() {
    return await obtenerPacientesRepository();
}

async function obtenerPacientePorId(id) {
    const paciente = await obtenerPacientePorIdRepository(id);

    if (paciente.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return paciente[0];
}

async function crearPaciente(apellido, nombre, dni, telefono) {
    const paciente = await crearPacienteRepository(apellido, nombre, dni, telefono);

    if (paciente.length === 0) {
        return {
            error: {
                code: "002",
                mensaje: "No se pudo crear el paciente",
                estado: 500,
            },
        };
    }

    return paciente[0];
}

async function actualizarPaciente(apellido, nombre, dni, telefono, id) {
    const paciente = await actualizarPacienteRepository(apellido, nombre, dni, telefono, id);

    if (paciente.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return paciente[0];
}

async function eliminarPaciente(id) {
    const paciente = await eliminarPacienteRepository(id);

    if (paciente.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return paciente[0];
}

async function obtenerPacientesFiltrados(filtros) {
    return await obtenerPacientesFiltradosRepository(filtros);
}

module.exports = {
    obtenerPacientes: obtenerPacientes,
    obtenerPacientePorId: obtenerPacientePorId,
    crearPaciente: crearPaciente,
    actualizarPaciente: actualizarPaciente,
    eliminarPaciente: eliminarPaciente,
    obtenerPacientesFiltrados: obtenerPacientesFiltrados,
};