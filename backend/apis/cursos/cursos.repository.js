const db = require("../../database/conexion");

async function obtenerTodos() {
  const query = `
    SELECT 
      c.Id_Curso AS "Id_Curso", 
      c.Nombre AS "Nombre", 
      c.Descripcion AS "Descripcion", 
      c.Id_Profesor AS "Id_Profesor",
      c.Vacantes AS "Vacantes",
      u.Nombre as nombre_profesor, 
      u.Apellido as apellido_profesor,
      (SELECT COUNT(*) FROM Matricula m WHERE m.Id_Curso = c.Id_Curso) AS "Matriculados"
    FROM Curso c 
    LEFT JOIN Usuario u ON c.Id_Profesor = u.Id_Usuario
    ORDER BY c.Id_Curso DESC
  `;
  const res = await db.query(query);
  return res.rows;
}

async function obtenerPorId(id) {
  const query = "SELECT Id_Curso AS \"Id_Curso\", Nombre AS \"Nombre\", Descripcion AS \"Descripcion\", Id_Profesor AS \"Id_Profesor\", Vacantes AS \"Vacantes\", (SELECT COUNT(*) FROM Matricula m WHERE m.Id_Curso = Curso.Id_Curso) AS \"Matriculados\" FROM Curso WHERE Id_Curso = $1";
  const res = await db.query(query, [id]);
  return res.rows[0];
}

async function crear(nombre, descripcion, id_profesor, vacantes = 30) {
  const query = "INSERT INTO Curso (Nombre, Descripcion, Id_Profesor, Vacantes) VALUES ($1, $2, $3, $4) RETURNING Id_Curso AS \"Id_Curso\", Nombre AS \"Nombre\", Descripcion AS \"Descripcion\", Id_Profesor AS \"Id_Profesor\", Vacantes AS \"Vacantes\"";
  const res = await db.query(query, [nombre, descripcion, id_profesor, vacantes]);
  return res.rows[0];
}

async function actualizar(id, nombre, descripcion, id_profesor, vacantes = 30) {
  const query = "UPDATE Curso SET Nombre = $1, Descripcion = $2, Id_Profesor = $3, Vacantes = $4 WHERE Id_Curso = $5 RETURNING Id_Curso AS \"Id_Curso\", Nombre AS \"Nombre\", Descripcion AS \"Descripcion\", Id_Profesor AS \"Id_Profesor\", Vacantes AS \"Vacantes\"";
  const res = await db.query(query, [nombre, descripcion, id_profesor, vacantes, id]);
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
