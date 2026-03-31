const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findByEmail, crearUsuario, obtenerUsuarios, eliminarUsuario } = require("./auth.repository");

async function login(email, clave) {
  try {
    console.log(`[AuthService] Intentando login para: ${email}`);
    const user = await findByEmail(email);
 
    if (!user) {
      console.warn(`[AuthService] Usuario no encontrado: ${email}`);
      throw new Error("Usuario no encontrado");
    }
 
    console.log(`[AuthService] Usuario encontrado: ${user.Email}. Comparando clave...`);
    const isMatch = await bcrypt.compare(
      String(clave).trim(),
      user.Clave.trim(),

    );
 
    if (!isMatch) {
       console.warn(`[AuthService] Contraseña INCORRECTA para: ${email}`);
      throw new Error("Credenciales inválidas");
    }
 
    console.log(`[AuthService] Login EXITOSO para: ${email}`);

    const token = jwt.sign(
      { id: user.Id_Usuario, nombre: user.Nombre, rol: user.Rol, email: user.Email },
      process.env.CLAVE_TOKEN || "IDAT_SECRET_2026",
      { expiresIn: "8h" },
    );

    return { 
      token, 
      user: {
        Id_Usuario: user.Id_Usuario,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Rol: user.Rol,
        Email: user.Email
      }
    };
  } catch (error) {
    console.error("Error dentro de auth.service:", error.message);
    throw error;
  }
}

async function registrar(nombre, apellido, email, claveOriginal, rol) {
  const rounds = 10;
  const claveHash = await bcrypt.hash(claveOriginal, rounds);

  return await crearUsuario(nombre, apellido, email, claveHash, rol);
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
