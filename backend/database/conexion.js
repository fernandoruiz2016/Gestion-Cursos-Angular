const { Pool } = require("pg");
require("dotenv").config({ quiet: true });

const client = new Pool({
  user: process.env.DB_USUARIO,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos"))
  .catch((err) => console.log(err));

module.exports = client;
