const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findByUsuario, crearUsuario, obtenerUsuarios, eliminarUsuario } = require("./auth.repository");

async function login(usuario, clave) {
  try {
    const user = await findByUsuario(usuario);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const isMatch = await bcrypt.compare(
      String(clave).trim(),
      user.clave.trim(),
    );

    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario },
      process.env.CLAVE_TOKEN || "IDAT_SECRET_2026",
      { expiresIn: "8h" },
    );

    return { token };
  } catch (error) {
    console.error("Error dentro de auth.service:", error.message);
    throw error;
  }
}

async function registrar(usuario, claveOriginal) {
  const rounds = 10;
  const claveHash = await bcrypt.hash(claveOriginal, rounds);

  return await crearUsuario(usuario, claveHash);
}

async function listarUsuarios(filtros) {
  return await obtenerUsuarios(filtros);
}

async function removerUsuario(id) {
  return await eliminarUsuario(id);
}

module.exports = {
  login: login,
  registrar: registrar,
  listarUsuarios: listarUsuarios,
  removerUsuario: removerUsuario,
};
