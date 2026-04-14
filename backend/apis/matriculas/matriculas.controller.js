const { listarMatriculas, matricularEstudiante, retirarMatricula, retirarMatriculaPorCurso } = require("./matriculas.service");

async function getAllController(req, res) {
  try {
    const { id_curso, id_estudiante } = req.query; // opcional para filtrar
    const matriculas = await listarMatriculas(id_curso, id_estudiante);
    res.status(200).json(matriculas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener matriculas" });
  }
}

async function createController(req, res) {
  try {
    const id_curso = req.body.Id_Curso || req.body.id_curso;
    const id_estudiante = req.body.Id_Estudiante || req.body.id_estudiante;

    if (!id_curso || !id_estudiante) {
      return res.status(400).json({ message: "Se requiere un curso y un estudiante separados" });
    }

    const nuevaMatricula = await matricularEstudiante(id_curso, id_estudiante);
    res.status(201).json(nuevaMatricula);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteController(req, res) {
  try {
    const { id } = req.params;
    await retirarMatricula(id);
    res.status(200).json({ message: "Matrícula eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al remover la matrícula" });
  }
}

// Opcional para retirar dando curso y usuario
async function deleteByCourseAndUserController(req, res) {
    try {
        const { id_curso, id_estudiante } = req.params;
        await retirarMatriculaPorCurso(id_curso, id_estudiante);
        res.status(200).json({ message: "Estudiante retirado del curso exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al remover la matrícula" });
    }
}

module.exports = {
  getAllController,
  createController,
  deleteController,
  deleteByCourseAndUserController
};
