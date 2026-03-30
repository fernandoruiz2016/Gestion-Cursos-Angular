const { obtenerUsuarios, crearUsuario, eliminarUsuario, obtenerPorId, actualizar } = require("./usuarios.repository");
const bcrypt = require("bcryptjs");

async function listarUsuarios(filtros) {
  return await obtenerUsuarios(filtros);
}

async function buscarUsuarioPorId(id) {
  return await obtenerPorId(id);
}

async function registrarUsuario(nombre, apellido, email, claveOriginal, rol) {
  const rounds = 10;
  const claveHash = await bcrypt.hash(claveOriginal, rounds);
  return await crearUsuario(nombre, apellido, email, claveHash, rol);
}

async function editarUsuario(id, nombre, apellido, email, rol) {
  return await actualizar(id, nombre, apellido, email, rol);
}

async function removerUsuario(id) {
  return await eliminarUsuario(id);
}

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  registrarUsuario,
  editarUsuario,
  removerUsuario,
};
