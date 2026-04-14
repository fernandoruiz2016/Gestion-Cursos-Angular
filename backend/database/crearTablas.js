const db = require("./conexion");

const sql = `
CREATE TABLE IF NOT EXISTS Usuario (
    Id_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Clave VARCHAR(255) NOT NULL,
    Rol VARCHAR(20) NOT NULL CHECK (Rol IN ('ADMIN', 'PROFESOR', 'ESTUDIANTE')) DEFAULT 'ESTUDIANTE'
);

CREATE TABLE IF NOT EXISTS Curso (
    Id_Curso SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Id_Profesor INTEGER REFERENCES Usuario(Id_Usuario) ON DELETE SET NULL,
    Vacantes INTEGER DEFAULT 30
);

CREATE TABLE IF NOT EXISTS Matricula (
    Id_Matricula SERIAL PRIMARY KEY,
    Id_Curso INTEGER REFERENCES Curso(Id_Curso) ON DELETE CASCADE,
    Id_Estudiante INTEGER REFERENCES Usuario(Id_Usuario) ON DELETE CASCADE,
    UNIQUE(Id_Curso, Id_Estudiante)
);

-- Usuario inicial (admin)
INSERT INTO Usuario (Nombre, Apellido, Email, Clave, Rol) 
VALUES ('Administrador', 'Sistema', 'admin@idat.edu.pe', '$2b$10$BWjA7AY001fejSphxB/b6OWNMA/WBqPm/.aaHD1arzpeczCQo9e9e', 'ADMIN') 
ON CONFLICT (Email) DO UPDATE SET Clave = EXCLUDED.Clave;
`;

function crearTablas() {
  return db
    .query(sql)
    .then(() => {
      console.log("Tablas creadas correctamente");
    })
    .catch((err) => {
      console.error("Error creando las tablas:", err);
      throw err;
    });
}

module.exports = crearTablas;
