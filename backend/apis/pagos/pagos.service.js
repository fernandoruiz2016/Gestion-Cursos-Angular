const { obtenerPagosRepository, obtenerPagoPorIdRepository, crearPagoRepository, actualizarPagoRepository, eliminarPagoRepository } = require("./pagos.repository")

async function obtenerPagos() {
    return await obtenerPagosRepository();
}

async function obtenerPagoPorId(id) {
    const pago = await obtenerPagoPorIdRepository(id);

    if (pago.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return pago[0];
}

async function crearPago(idCita, monto, metodoPago) {
    const pago = await crearPagoRepository(idCita, monto, metodoPago);

    if (pago.length === 0) {
        return {
            error: {
                code: "002",
                mensaje: "No se pudo crear el pago",
                estado: 500,
            },
        };
    }

    return pago[0];
}

async function actualizarPago(idCita, monto, metodoPago, id) {
    const pago = await actualizarPagoRepository(idCita, monto, metodoPago, id);

    if (pago.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return pago[0];
}

async function eliminarPago(id) {
    const pago = await eliminarPagoRepository(id);

    if (pago.length === 0) {
        return {
            error: {
                code: "001",
                mensaje: "Elemento no encontrado",
                estado: 404,
            },
        };
    }

    return pago[0];
}

module.exports = {
  obtenerPagos: obtenerPagos,
  obtenerPagoPorId: obtenerPagoPorId,
  crearPago: crearPago,
  actualizarPago: actualizarPago,
  eliminarPago: eliminarPago
};