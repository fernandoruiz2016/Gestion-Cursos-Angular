const { listarUsuarios, buscarUsuarioPorId, registrarUsuario, editarUsuario, removerUsuario } = require("./usuarios.service");

async function getAllController(req, res) {
  try {
    const filtros = req.query;
    const usuarios = await listarUsuarios(filtros);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

async function getByIdController(req, res) {
  try {
    const { id } = req.params;
    const usuario = await buscarUsuarioPorId(id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
}

async function createController(req, res) {
  try {
    const nombre = req.body.Nombre || req.body.nombre;
    const apellido = req.body.Apellido || req.body.apellido;
    const email = req.body.Email || req.body.email;
    const clave = req.body.Clave || req.body.clave;
    const rol = req.body.Rol || req.body.rol;
    
    if (!nombre || !email) {
       return res.status(400).json({ message: "Nombre y Email son obligatorios" });
    }

    const nuevoUsuario = await registrarUsuario(nombre, apellido, email, clave, rol);
    res.status(201).json({ message: "Usuario creado", userId: nuevoUsuario.Id_Usuario || nuevoUsuario.id_usuario });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: error.message || "Error al crear el usuario" });
  }
}

async function updateController(req, res) {
  try {
    const { id } = req.params;
    const nombre = req.body.Nombre || req.body.nombre;
    const apellido = req.body.Apellido || req.body.apellido;
    const email = req.body.Email || req.body.email;
    const rol = req.body.Rol || req.body.rol;

    const usuarioActualizado = await editarUsuario(id, nombre, apellido, email, rol);
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: error.message || "Error al actualizar el usuario" });
  }
}

async function deleteController(req, res) {
  try {
    const { id } = req.params;
    await removerUsuario(id);
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
}

module.exports = {
  getAllController,
  getByIdController,
  createController,
  updateController,
  deleteController,
};
