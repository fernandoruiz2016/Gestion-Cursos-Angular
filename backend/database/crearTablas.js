const db = require("./conexion");

const sql = `
CREATE TABLE IF NOT EXISTS Paciente (
    Id_Paciente SERIAL PRIMARY KEY,
    Apellido VARCHAR(50) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    DNI char(8) NOT NULL UNIQUE,
    Telefono varchar(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS Especialidad (
    Id_Especialidad SERIAL PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Medico (
    Id_Medico SERIAL PRIMARY KEY,
    Apellido VARCHAR(50) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    DNI char(8) NOT NULL,
    Telefono varchar(15) NOT NULL,
    Id_Especialidad INTEGER REFERENCES Especialidad(Id_Especialidad)
);

CREATE TABLE IF NOT EXISTS Cita (
    Id_Cita SERIAL PRIMARY KEY,
    Id_Paciente INTEGER NOT NULL,
    Id_Medico INTEGER NOT NULL,
    Estado varchar(15) NOT NULL CHECK (Estado IN ('Programada','Atendida','Cancelada','No asistio')),
    Fecha DATE NOT NULL,
    Hora time NOT NULL,

    CONSTRAINT fk_paciente
    FOREIGN KEY (Id_Paciente)
    REFERENCES Paciente (Id_Paciente)
    ON DELETE CASCADE,

    CONSTRAINT fk_medico
    FOREIGN KEY (Id_Medico)
    REFERENCES Medico (Id_Medico)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Pago (
    Id_Pago SERIAL PRIMARY KEY,
    Id_Cita INTEGER NOT NULL UNIQUE, -- UNIQUE garantiza que una cita no se pague dos veces
    Monto DECIMAL(10, 2) NOT NULL CHECK (Monto >= 0),
    Fecha_Pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Metodo_Pago VARCHAR(20) NOT NULL CHECK (Metodo_Pago IN ('Efectivo', 'Tarjeta', 'Transferencia')),
    
    CONSTRAINT fk_cita_pago
    FOREIGN KEY (Id_Cita)
    REFERENCES Cita (Id_Cita)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Usuario (
    Id_Usuario SERIAL PRIMARY KEY,
    Usuario VARCHAR(50) NOT NULL UNIQUE,
    Clave VARCHAR(255) NOT NULL,
    Rol VARCHAR(20) DEFAULT 'Admin'
);

INSERT INTO Usuario (Usuario, Clave) 
VALUES ('admin', '$2b$10$u8zdQdtMRsGzlU8QWOPlVuBpRst6GNjOdLbahBWA.d3pSExh8upIa') 
ON CONFLICT (Usuario) DO NOTHING;
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
