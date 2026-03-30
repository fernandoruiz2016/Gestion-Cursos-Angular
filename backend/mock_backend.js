const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const secretToken = "mock-jwt-token";
const mockUserAdmin = { id: 1, Nombre: "Admin", Rol: "ADMIN", Email: "admin@test.com" };
const mockUserStudent = { id: 2, Nombre: "Estudiante", Rol: "ESTUDIANTE", Email: "student@test.com" };

// Interceptor for logging requests
app.use((req, res, next) => {
    console.log(`[Mock API] ${req.method} ${req.url}`);
    if (req.headers.authorization) {
        console.log(`[Mock API] Auth: ${req.headers.authorization}`);
    }
    next();
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
    const { Email, Clave } = req.body;
    if (Email === 'admin@test.com' && Clave === '123456') {
        res.json({ token: secretToken + "-admin", user: mockUserAdmin });
    } else if (Email === 'student@test.com' && Clave === '123456') {
        res.json({ token: secretToken + "-student", user: mockUserStudent });
    } else {
        res.status(401).json({ message: "Credenciales inválidas" });
    }
});

// User routes
app.get('/api/usuarios', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.includes("-admin")) return res.status(403).json({ message: "Acceso denegado" });
    res.json([mockUserAdmin, mockUserStudent]);
});

// Course routes
app.get('/api/cursos', (req, res) => {
    res.json([{ id: 1, Nombre: "Angular Pro", Descripcion: "Curso avanzado" }]);
});

app.post('/api/cursos', (req, res) => {
    res.status(201).json({ id: Date.now(), ...req.body });
});

app.listen(port, () => {
    console.log(`Mock system listening at http://localhost:${port}`);
});
