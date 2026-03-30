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
    const { nombre, descripcion, id_profesor } = req.body;
    const nuevoCurso = await crearCurso(nombre, descripcion, id_profesor);
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el curso" });
  }
}

async function updateController(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, id_profesor } = req.body;
    const cursoActualizado = await editarCurso(id, nombre, descripcion, id_profesor);
    res.status(200).json(cursoActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el curso" });
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
