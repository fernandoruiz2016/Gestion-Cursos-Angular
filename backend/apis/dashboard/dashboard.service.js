const dashboardRepository = require("./dashboard.repository");

async function obtenerDashboard() {
  return await dashboardRepository.obtenerResumenDashboard();
}

module.exports = {
  obtenerDashboard,
};
