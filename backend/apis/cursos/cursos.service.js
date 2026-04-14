const { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } = require("./cursos.repository");

async function listarCursos() {
  return await obtenerTodos();
}

async function buscarCursoPorId(id) {
  return await obtenerPorId(id);
}

async function crearCurso(nombre, descripcion, id_profesor, vacantes) {
  return await crear(nombre, descripcion, id_profesor, vacantes);
}

async function editarCurso(id, nombre, descripcion, id_profesor, vacantes) {
  return await actualizar(id, nombre, descripcion, id_profesor, vacantes);
}

async function removerCurso(id) {
  return await eliminar(id);
}

module.exports = {
  listarCursos,
  buscarCursoPorId,
  crearCurso,
  editarCurso,
  removerCurso,
};
