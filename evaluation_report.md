# Reporte de Evaluación Técnica - IDAT
**Curso:** Desarrollo de Interfaces 3
**Proyecto:** Gestión de Cursos y Usuarios

---

## 📋 Resumen de Cumplimiento

Tras analizar la arquitectura, seguridad y buenas prácticas del proyecto (Backend y Frontend), se ha determinado el siguiente nivel de cumplimiento basado en los criterios de la rúbrica para el nivel **'Sobresaliente'**.

| Criterio | Nivel Alcanzado | Observación |
| :--- | :--- | :--- |
| **Arquitectura** | ⭐ **Sobresaliente** | Separación clara en el Backend (Controller/Service/Repository) y Frontend (Servicios por entidad centralizando HTTP). |
| **Rutas & Lazy Loading** | ⭐ **Sobresaliente** | Implementación exitosa de `loadComponent`, rutas protegidas y manejo de rutas no encontradas. |
| **Guards** | ⭐ **Sobresaliente** | Uso de múltiples guards (`AuthGuard` y `RoleGuard`) con redirecciones automáticas coherentes. |
| **JWT & Interceptor** | ⭐ **Sobresaliente** | `HttpInterceptor` configurado para inserción de token y manejo global de errores (401/403). |
| **Buenas Prácticas** | 🟠 **Logrado** | No se detectaron Pipes o Directivas personalizadas, requisito para el nivel 'Sobresaliente'. |

---

## 🔍 Detalle del Análisis

### 1. Arquitectura
*   **Backend:** Se observa una estructura robusta con separación de responsabilidades en `apis/cursos` y `apis/usuarios`. Cada una cuenta con su propio controlador, servicio y repositorio.
*   **Frontend:** Los servicios `CourseService` y `UserService` están correctamente aislados por entidad y encapsulan la lógica de `HttpClient`, facilitando el mantenimiento.

### 2. Rutas y Lazy Loading
*   Se utiliza `loadComponent` en `app.routes.ts` para cargar diferidamente los componentes, optimizando el rendimiento inicial.
*   **Manejo 404:** La ruta comodín `**` redirige correctamente al login. 
    > [!TIP]
    > Para asegurar el puntaje máximo, se recomienda crear un componente `NotFoundComponent` dedicado en lugar de solo redirigir.

### 3. Guards de Seguridad
*   **AuthGuard:** Verifica la existencia del token antes de permitir el acceso al dashboard.
*   **RoleGuard:** Controla el acceso granular basado en roles (`ADMIN`, `PROFESOR`), redirigiendo al dashboard si el usuario no tiene permisos. Cumple perfectamente con la lógica de redirección automática.

### 4. JWT e Interceptors
*   El `jwtInterceptor` clona las peticiones salientes para insertar el header `Authorization`.
*   Incluye un bloque `catchError` que detecta expiración de sesión (401) y denegación de acceso (403), ejecutando un `logout` automático. Esto centraliza la seguridad de la app.

### 5. Buenas Prácticas (Pipes/Directivas)
*   **Estado:** No se encontraron archivos `.pipe.ts` o `.directive.ts` personalizados.
*   **Requerimiento:** Para alcanzar el nivel 'Sobresaliente', la rúbrica solicita la implementación de al menos un Pipe (ej: para formatear nombres o roles) o una Directiva (ej: para control de visibilidad por rol en el HTML).

---

## 🚀 Recomendaciones antes de la entrega

Para asegurar el **20 (Sobresaliente)** en todos los puntos, te sugiero implementar lo siguiente:

1.  **Crear un Pipe Personalizado:** Por ejemplo, un Pipe `RoleNamePipe` que transforme "ADMIN" en "Administrador" para mostrarlo en la UI.
2.  **Crear una Directiva Estructural:** Una directiva `*appHasRole="['ADMIN']"` para ocultar botones o secciones del menú directamente en el HTML según el rol del usuario.
3.  **Página 404:** Crear un componente visual para rutas inexistentes con un botón de "Volver al Inicio".

---
**Evaluador:** Antigravity AI (Técnico IDAT)
**Fecha:** 29 de marzo de 2026
