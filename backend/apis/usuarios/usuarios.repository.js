const { obtenerUsuarios, crearUsuario, eliminarUsuario, findByEmail } = require("../auth/auth.repository");
const db = require("../../database/conexion");

async function obtenerPorId(id) {
  const query = "SELECT id_usuario AS \"Id_Usuario\", nombre AS \"Nombre\", apellido AS \"Apellido\", email AS \"Email\", rol AS \"Rol\" FROM Usuario WHERE id_usuario = $1";
  const res = await db.query(query, [id]);
  return res.rows[0];
}

async function actualizar(id, nombre, apellido, email, rol) {
  const query = "UPDATE Usuario SET Nombre = $1, Apellido = $2, Email = $3, Rol = $4 WHERE Id_Usuario = $5 RETURNING id_usuario AS \"Id_Usuario\", nombre AS \"Nombre\", apellido AS \"Apellido\", email AS \"Email\", rol AS \"Rol\"";
  const res = await db.query(query, [nombre, apellido, email, rol, id]);
  return res.rows[0];
}

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  eliminarUsuario,
  obtenerPorId,
  actualizar,
  findByEmail,
};
