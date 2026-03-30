const db = require("../../database/conexion");

async function obtenerResumenDashboard() {
  const result = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM cita WHERE fecha = CURRENT_DATE) AS citas_hoy,
      (SELECT COUNT(*) FROM cita WHERE estado = 'Programada' AND fecha >= CURRENT_DATE) AS citas_pendientes,
      (SELECT COUNT(*) FROM paciente) AS total_pacientes
  `);

  return result.rows[0];
}

module.exports = {
  obtenerResumenDashboard,
};
