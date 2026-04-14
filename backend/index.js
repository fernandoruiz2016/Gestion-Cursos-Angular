const express = require("express");
const cors = require("cors");
require("dotenv").config({quiet:true});

const crearTablas = require("./database/crearTablas");

const usuariosApi = require("./apis/usuarios");
const cursosApi = require("./apis/cursos");
const authApi = require("./apis/auth");
const matriculasApi = require("./apis/matriculas");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuariosApi);
app.use("/api/cursos", cursosApi);
app.use("/api/auth", authApi);
app.use("/api/matriculas", matriculasApi);

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  crearTablas();
  console.log(`Servidor escuchando en el puerto ${port}`);
});
