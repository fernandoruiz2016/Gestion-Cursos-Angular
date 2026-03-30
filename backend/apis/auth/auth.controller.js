const { login, registrar, listarUsuarios, removerUsuario } = require("./auth.service");

async function loginController(req, res) {
  try {
    const { usuario, clave } = req.body;
    const result = await login(usuario, clave);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function registerController(req, res) {
  try {
    const { usuario, clave, rol } = req.body;

    const nuevoUsuario = await registrar(usuario, clave, rol);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: nuevoUsuario.id,
    });
  } catch (error) {
    console.error("[Register Error]:", error.message);
    return res.status(400).json({ message: error.message });
  }
}

async function listadoController(req, res) {
  try {
    const filtros = req.query;
    const usuarios = await listarUsuarios(filtros);
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

async function eliminarController(req, res) {
  try {
    const { id } = req.params;
    await removerUsuario(id);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
}

module.exports = {
  loginController: loginController,
  registerController: registerController,
  listadoController: listadoController,
  eliminarController: eliminarController,
};
