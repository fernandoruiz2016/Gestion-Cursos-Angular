const express = require("express");
const { getAllController, createController, deleteController, deleteByCourseAndUserController } = require("./matriculas.controller");

const router = express.Router();

router.get("/", getAllController);
router.post("/", createController);
router.delete("/:id", deleteController);
router.delete("/curso/:id_curso/estudiante/:id_estudiante", deleteByCourseAndUserController);

module.exports = router;
