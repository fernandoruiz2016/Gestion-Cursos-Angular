const dashboardService = require("./dashboard.service");

async function obtenerDashboard(req, res) {
  try {
    const data = await dashboardService.obtenerDashboard();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener dashboard" });
  }
}

module.exports = {
  obtenerDashboard,
};
