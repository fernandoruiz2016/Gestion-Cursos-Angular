const db = require("../../database/conexion");

async function obtenerPacientesRepository() {
    const resultadoDeConsulta = await db.query("SELECT * FROM paciente");

    return resultadoDeConsulta.rows
}

async function obtenerPacientePorIdRepository(id) {
    const resultadoDeConsulta = await db.query(
        "SELECT * FROM paciente WHERE id_paciente = $1",
        [id]
    );

    return resultadoDeConsulta.rows;
}

async function crearPacienteRepository(apellido, nombre, dni, telefono) {
    const resultadoDeConsulta = await db.query(
        "INSERT INTO paciente (apellido, nombre, dni, telefono) VALUES ($1, $2, $3, $4) RETURNING *",
        [apellido, nombre, dni, telefono]
    );

    return resultadoDeConsulta.rows;
}

async function actualizarPacienteRepository(apellido, nombre, dni, telefono, id) {
    const resultadoDeConsulta = await db.query(
        "UPDATE paciente SET apellido = $1, nombre = $2, dni = $3, telefono = $4 WHERE id_paciente = $5 RETURNING *",
        [apellido, nombre, dni, telefono, id]
    );

    return resultadoDeConsulta.rows;
}

async function eliminarPacienteRepository(id) {
    const resultadoDeConsulta = await db.query(
        "DELETE FROM paciente WHERE id_paciente = $1 RETURNING *",
        [id]
    );

    return resultadoDeConsulta.rows;
}

async function obtenerPacientesFiltradosRepository(filtros = {}) {
    const { dni, nombre, apellido, telefono } = filtros;
    let query = "SELECT * FROM paciente WHERE 1=1";
    const values = [];
    let count = 1;

    if (dni) {
        query += ` AND dni LIKE $${count++}`;
        values.push(`${dni}%`);
    }
    if (nombre) {
        query += ` AND nombre ILIKE $${count++}`;
        values.push(`%${nombre}%`);
    }
    if (apellido) {
        query += ` AND apellido ILIKE $${count++}`;
        values.push(`%${apellido}%`);
    }
    if (telefono) {
        query += ` AND telefono LIKE $${count++}`;
        values.push(`%${telefono}%`);
    }

    query += " ORDER BY apellido ASC, nombre ASC";
    const resultadoDeConsulta = await db.query(query, values);
    return resultadoDeConsulta.rows;
}

module.exports = {
    obtenerPacientesRepository: obtenerPacientesRepository,
    obtenerPacientePorIdRepository: obtenerPacientePorIdRepository,
    crearPacienteRepository: crearPacienteRepository,
    actualizarPacienteRepository: actualizarPacienteRepository,
    eliminarPacienteRepository: eliminarPacienteRepository,
    obtenerPacientesFiltradosRepository: obtenerPacientesFiltradosRepository,
};