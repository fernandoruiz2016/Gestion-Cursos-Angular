# Sistema de Gestión de Cursos - Desarollo de Interfaces 3

Un sistema integral "Full Stack" para la gestión de usuarios, roles educativos y un catálogo de cursos, desarrollado como proyecto final para el curso **Desarrollo de Interfaces 3** de IDAT.

## Tecnologías y Arquitectura

### Frontend (Angular)
- **Framework:** Angular 20
- **Control de Flujo:** Uso de la sintaxis moderna `@if`, `@for`, y `@empty`
- **Formularios:** Construido íntegramente usando `ReactiveFormsModule`
- **Arquitectura de Carpetas:** Separación limpia por responsabilidades: `core/`, `shared/` y `features/`.
- **Rutas y Seguridad:** Angular Router con Lazy Loading, Protección de Rutas (`AuthGuard`) y Guardias de Roles (`RoleGuard`).
- **Pipes Customizados:** `RolePipe` para transformar roles técnicos en _labels_ de interfaz visual.
- **Directivas:** `HasRoleDirective` (`*appHasRole`) para control asíncrono de Acceso Basado en Roles (RBAC) desde directamente desde las plantillas HTML.

### Backend (Node.js & Express)
- **API:** RESTful API estructurada utilizando abstracciones e Inyección de Dependencias.
- **Seguridad:** JSON Web Tokens (JWT) para control de sesión e interceptores, encriptación de datos utilizando `bcryptjs`.
- **Base de Datos:** PostgreSQL con la capa de persistencia abstraída en una estructura Repository Pattern y migración automática desde Javascript.

---

## Usuarios y Roles (`RBAC`)

El sistema maneja un control estricto de accesos limitados según rol (`enum` de roles).

1. **Administrador (`ADMIN`):** 
   - Credenciales Demo: `admin@idat.edu.pe / 123456`
   - Acceso total. Puede crear, listar, modificar y eliminar tanto usuarios (otros recursos) como cursos en el sistema.

2. **Profesor (`PROFESOR`):**
   - Acceso parcial. Puede acceder a los Dashboard y ver exclusivamente el listado y paneles de Cursos de la institución. No tiene permitido ver o gestionar otros usuarios.

3. **Estudiante (`ESTUDIANTE`):**
   - Acceso restringido. Visualiza solamente métricas de su panel en el dashboard.

---

## Instalación y Puesta en Marcha

### 1️⃣ Base de Datos
1. Asegúrate de tener PostgreSQL ejecutándose localmente o remotamente (Puerto estándar: `5432`).
2. Configura los parámetros en tu archivo `/backend/.env`. El sistema creará automáticamente la tabla `Usuario` y `Curso`, junto con un usuario administrador por defecto si la base de datos se inicializa nueva.

### 2️⃣ Backend Server
Sitúate dentro de la carpeta local `./backend`:
```bash
npm install
node index.js
```
El proceso del backend se ejecutará bajo `http://localhost:3000`

### 3️⃣ Frontend Client
Abre otra terminal local dentro de la carpeta `./frontend`:
```bash
npm install
ng serve
```
El entorno de navegación cliente se levantará sobre `http://localhost:4200`. Si detecta rutas inválidas forzará la redirección al login automáticamente o la pantalla `404 Not Found`.
