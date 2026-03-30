const { login, registrar, listarUsuarios, removerUsuario } = require("./auth.service");

async function loginController(req, res) {
  try {
    const email = req.body.Email || req.body.email;
    const clave = req.body.Clave || req.body.clave;
    const result = await login(email, clave);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

async function registerController(req, res) {
  try {
    const { nombre, apellido, email, clave, rol } = req.body;

    const nuevoUsuario = await registrar(nombre, apellido, email, clave, rol);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: nuevoUsuario.id_usuario,
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
