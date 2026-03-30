const express = require("express");
const router = express.Router();
const { loginController, registerController, listadoController, eliminarController } = require("./auth.controller");

router.post("/login", loginController);

router.post("/register", registerController);

router.get("/listado", listadoController);

router.delete("/:id", eliminarController);

module.exports = router;