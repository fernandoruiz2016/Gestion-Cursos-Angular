const { listarCursos, buscarCursoPorId, crearCurso, editarCurso, removerCurso } = require("./cursos.service");

async function getAllController(req, res) {
  try {
    const cursos = await listarCursos();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cursos" });
  }
}

async function getByIdController(req, res) {
  try {
    const { id } = req.params;
    const curso = await buscarCursoPorId(id);
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
    res.status(200).json(curso);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el curso" });
  }
}

async function createController(req, res) {
  try {
    const nombre = req.body.Nombre || req.body.nombre;
    const descripcion = req.body.Descripcion || req.body.descripcion;
    const id_profesor = req.body.Id_Profesor || req.body.id_profesor;
    const vacantes = req.body.Vacantes !== undefined ? req.body.Vacantes : 30;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre del curso es obligatorio" });
    }

    const nuevoCurso = await crearCurso(nombre, descripcion, id_profesor, vacantes);
    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(400).json({ message: error.message || "Error al crear el curso" });
  }
}

async function updateController(req, res) {
  try {
    const { id } = req.params;
    const nombre = req.body.Nombre || req.body.nombre;
    const descripcion = req.body.Descripcion || req.body.descripcion;
    const id_profesor = req.body.Id_Profesor || req.body.id_profesor;
    const vacantes = req.body.Vacantes !== undefined ? req.body.Vacantes : 30;

    const cursoActualizado = await editarCurso(id, nombre, descripcion, id_profesor, vacantes);
    res.status(200).json(cursoActualizado);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(400).json({ message: error.message || "Error al actualizar el curso" });
  }
}

async function deleteController(req, res) {
  try {
    const { id } = req.params;
    await removerCurso(id);
    res.status(200).json({ message: "Curso eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso" });
  }
}

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
