const db = require("../../database/conexion");

async function obtenerPagosRepository() {
  const query = `
    SELECT pg.*, p.Nombre as paciente, c.Fecha as fecha_cita
    FROM Pago pg
    JOIN Cita c ON pg.Id_Cita = c.Id_Cita
    JOIN Paciente p ON c.Id_Paciente = p.Id_Paciente
  `;
  const resultadoDeConsulta = await db.query(query);
  return resultadoDeConsulta.rows;
}

async function obtenerPagoPorIdRepository(id) {
  const resultadoDeConsulta = await db.query(
    "SELECT * FROM pago WHERE id_pago = $1",
    [id],
  );

  return resultadoDeConsulta.rows;
}

async function crearPagoRepository(idCita, monto, metodoPago) {
  // Nota: La fecha se genera sola por el DEFAULT CURRENT_TIMESTAMP del SQL
  const resultadoDeConsulta = await db.query(
    "INSERT INTO Pago (Id_Cita, Monto, Metodo_Pago) VALUES ($1, $2, $3) RETURNING *",
    [idCita, monto, metodoPago],
  );
  return resultadoDeConsulta.rows;
}

async function actualizarPagoRepository(idCita, monto, metodoPago, id) {
  const resultadoDeConsulta = await db.query(
    "UPDATE Pago SET Id_Cita = $1, Monto = $2, Metodo_Pago = $3 WHERE Id_Pago = $4 RETURNING *",
    [idCita, monto, metodoPago, id],
  );

  return resultadoDeConsulta.rows;
}

async function eliminarPagoRepository(id) {
  const resultadoDeConsulta = await db.query(
    "DELETE FROM pago WHERE id_pago = $1 RETURNING *",
    [id],
  );

  return resultadoDeConsulta.rows;
}

module.exports = {
  obtenerPagosRepository: obtenerPagosRepository,
  obtenerPagoPorIdRepository: obtenerPagoPorIdRepository,
  crearPagoRepository: crearPagoRepository,
  actualizarPagoRepository: actualizarPagoRepository,
  eliminarPagoRepository: eliminarPagoRepository
};
