const db = require("../../database/conexion");

async function findByEmail(email) {
  const query = "SELECT * FROM Usuario WHERE Email ILIKE $1";
  const res = await db.query(query, [email]);

  if (res.rows.length > 0) {
    const u = res.rows[0];
    return {
      id: u.id_usuario,
      nombre: u.nombre,
      apellido: u.apellido,
      email: u.email,
      clave: u.clave,
      rol: u.rol,
    };
  }
  return null;
}

async function crearUsuario(nombre, apellido, email, claveEncriptada, rol = 'ESTUDIANTE') {
  const query =
    "INSERT INTO Usuario (Nombre, Apellido, Email, Clave, Rol) VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario";
  const res = await db.query(query, [nombre, apellido, email, claveEncriptada, rol]);
  return res.rows[0];
}

async function obtenerUsuarios(filtros) {
  let query = "SELECT id_usuario, nombre, apellido, email, rol FROM Usuario WHERE 1=1";
  const params = [];

  if (filtros.nombre) {
    params.push(`%${filtros.nombre}%`);
    query += ` AND (nombre Ilike $${params.length} OR apellido Ilike $${params.length})`;
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
    "DELETE FROM Usuario WHERE id_usuario = $1 AND email != 'admin@idat.edu.pe'";
  return await db.query(query, [id]);
}

module.exports = {
  findByEmail: findByEmail,
  crearUsuario: crearUsuario,
  obtenerUsuarios: obtenerUsuarios,
  eliminarUsuario: eliminarUsuario,
};
