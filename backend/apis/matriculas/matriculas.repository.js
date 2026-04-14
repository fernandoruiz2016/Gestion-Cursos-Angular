const db = require("../../database/conexion");

async function obtenerTodos(id_curso, id_estudiante) {
  let query = `
    SELECT 
      m.Id_Matricula AS "Id_Matricula", 
      m.Id_Curso AS "Id_Curso", 
      m.Id_Estudiante AS "Id_Estudiante",
      u.Nombre AS "Nombre_Estudiante",
      u.Apellido AS "Apellido_Estudiante",
      u.Email AS "Email_Estudiante",
      c.Nombre AS "Nombre_Curso"
    FROM Matricula m
    JOIN Usuario u ON m.Id_Estudiante = u.Id_Usuario
    JOIN Curso c ON m.Id_Curso = c.Id_Curso
    WHERE 1=1
  `;
  const params = [];

  if (id_curso) {
    params.push(id_curso);
    query += ` AND m.Id_Curso = $${params.length}`;
  }

  if (id_estudiante) {
      params.push(id_estudiante);
      query += ` AND m.Id_Estudiante = $${params.length}`;
  }

  const res = await db.query(query, params);
  return res.rows;
}

async function crear(id_curso, id_estudiante) {
  const query = `
    INSERT INTO Matricula (Id_Curso, Id_Estudiante) 
    VALUES ($1, $2) 
    RETURNING 
      Id_Matricula AS "Id_Matricula", 
      Id_Curso AS "Id_Curso", 
      Id_Estudiante AS "Id_Estudiante"
  `;
  const res = await db.query(query, [id_curso, id_estudiante]);
  return res.rows[0];
}

async function eliminar(id_matricula) {
  const query = "DELETE FROM Matricula WHERE Id_Matricula = $1";
  return await db.query(query, [id_matricula]);
}

async function eliminarPorCursoYEstudiante(id_curso, id_estudiante) {
    const query = "DELETE FROM Matricula WHERE Id_Curso = $1 AND Id_Estudiante = $2";
    return await db.query(query, [id_curso, id_estudiante]);
}

async function contarMatriculasPorCurso(id_curso) {
  const query = "SELECT COUNT(*) FROM Matricula WHERE Id_Curso = $1";
  const res = await db.query(query, [id_curso]);
  return parseInt(res.rows[0].count, 10);
}

// Extra: traer un curso especifico para validación
async function obtenerCursoInfo(id_curso) {
    const query = "SELECT Vacantes AS \"Vacantes\" FROM Curso WHERE Id_Curso = $1";
    const res = await db.query(query, [id_curso]);
    return res.rows[0];
}

// Extra: validar usario estudiante
async function obtenerUsuarioInfo(id_usuario) {
    const query = "SELECT Rol AS \"Rol\" FROM Usuario WHERE Id_Usuario = $1";
    const res = await db.query(query, [id_usuario]);
    return res.rows[0];
}


module.exports = {
  obtenerTodos,
  crear,
  eliminar,
  eliminarPorCursoYEstudiante,
  contarMatriculasPorCurso,
  obtenerCursoInfo,
  obtenerUsuarioInfo
};
