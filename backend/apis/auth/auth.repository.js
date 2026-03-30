const db = require("../../database/conexion");

async function findByUsuario(usuario) {
  const query = "SELECT * FROM Usuario WHERE Usuario = $1";
  const res = await db.query(query, [usuario]);

  if (res.rows.length > 0) {
    const u = res.rows[0];
    return {
      id: u.id_usuario,
      usuario: u.usuario,
      clave: u.clave,
    };
  }
  return null;
}

async function crearUsuario(usuario, claveEncriptada, rol = "Admin") {
  const query =
    "INSERT INTO Usuario (Usuario, Clave, Rol) VALUES ($1, $2, $3) RETURNING id_usuario";
  const res = await db.query(query, [usuario, claveEncriptada, rol]);
  return res.rows[0];
}

async function obtenerUsuarios(filtros) {
  let query = "SELECT id_usuario, usuario, rol FROM Usuario WHERE 1=1";
  const params = [];

  if (filtros.usuario) {
    params.push(`%${filtros.usuario}%`);
    query += ` AND usuario Ilike $${params.length}`;
  }

  if (filtros.rol) {
    params.push(filtros.rol);
    query += ` AND rol = $${params.length}`;
  }

  query += " ORDER BY id_usuario DESC";
  const res = await db.query(query, params);
  return res.rows;
}

async function eliminarUsuario(id) {
  const query =
    "DELETE FROM Usuario WHERE id_usuario = $1 AND usuario != 'admin'";
  return await db.query(query, [id]);
}

module.exports = {
  findByUsuario: findByUsuario,
  crearUsuario: crearUsuario,
  obtenerUsuarios: obtenerUsuarios,
  eliminarUsuario: eliminarUsuario,
};
