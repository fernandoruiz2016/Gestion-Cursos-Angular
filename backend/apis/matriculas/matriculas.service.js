const matriculasRepo = require("./matriculas.repository");

async function listarMatriculas(id_curso, id_estudiante) {
  return await matriculasRepo.obtenerTodos(id_curso, id_estudiante);
}

async function matricularEstudiante(id_curso, id_estudiante) {
  // 1. Validar Usuario (existe y es estudiante)
  const usuario = await matriculasRepo.obtenerUsuarioInfo(id_estudiante);
  if (!usuario) throw new Error("Usuario no encontrado.");
  if (usuario.Rol !== 'ESTUDIANTE') throw new Error("Solo los usuarios con rol ESTUDIANTE pueden ser matriculados.");

  // 2. Validar Curso y vacantes
  const curso = await matriculasRepo.obtenerCursoInfo(id_curso);
  if (!curso) throw new Error("Curso no encontrado.");

  const matriculadosActual = await matriculasRepo.contarMatriculasPorCurso(id_curso);
  if (matriculadosActual >= curso.Vacantes) {
    throw new Error("No hay vacantes disponibles para este curso.");
  }

  // 3. Crear matrícula
  try {
    return await matriculasRepo.crear(id_curso, id_estudiante);
  } catch (error) {
    if (error.code === '23505') { // Postgres unique violation
        throw new Error("El estudiante ya se encuentra matriculado en este curso.");
    }
    throw error;
  }
}

async function retirarMatricula(id_matricula) {
  return await matriculasRepo.eliminar(id_matricula);
}

async function retirarMatriculaPorCurso(id_curso, id_estudiante) {
    return await matriculasRepo.eliminarPorCursoYEstudiante(id_curso, id_estudiante);
}

module.exports = {
  listarMatriculas,
  matricularEstudiante,
  retirarMatricula,
  retirarMatriculaPorCurso
};
