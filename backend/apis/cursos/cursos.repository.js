const db = require("../../database/conexion");

async function obtenerTodos() {
  const query = `
    SELECT c.*, u.Nombre as nombre_profesor, u.Apellido as apellido_profesor 
    FROM Curso c 
    LEFT JOIN Usuario u ON c.Id_Profesor = u.Id_Usuario
  `;
  const res = await db.query(query);
  return res.rows;
}

async function obtenerPorId(id) {
  const query = "SELECT * FROM Curso WHERE Id_Curso = $1";
  const res = await db.query(query, [id]);
  return res.rows[0];
}

async function crear(nombre, descripcion, id_profesor) {
  const query = "INSERT INTO Curso (Nombre, Descripcion, Id_Profesor) VALUES ($1, $2, $3) RETURNING *";
  const res = await db.query(query, [nombre, descripcion, id_profesor]);
  return res.rows[0];
}

async function actualizar(id, nombre, descripcion, id_profesor) {
  const query = "UPDATE Curso SET Nombre = $1, Descripcion = $2, Id_Profesor = $3 WHERE Id_Curso = $4 RETURNING *";
  const res = await db.query(query, [nombre, descripcion, id_profesor, id]);
  return res.rows[0];
}

async function eliminar(id) {
  const query = "DELETE FROM Curso WHERE Id_Curso = $1";
  return await db.query(query, [id]);
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
