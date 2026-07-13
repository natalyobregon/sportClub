# Uso de Inteligencia Artificial (IA)

## Herramienta utilizada

Durante el desarrollo del proyecto se utilizó **Claude (Anthropic)**, a través de la plataforma **Claude.ai**, como una herramienta de apoyo.

## Alcance del uso

La inteligencia artificial se utilizó para apoyar tareas específicas del desarrollo, principalmente relacionadas con la interfaz de usuario y la revisión del código. Su participación incluyó:

* Mejoras en la interfaz (UI/UX) de un proyecto que ya se encontraba funcional, optimizando modales, tablas, dashboards, la página de inicio y las pantallas de inicio de sesión y registro, sin modificar la lógica de negocio ni la integración con el backend entregado por el docente.
* Generación de componentes visuales de apoyo, como un conjunto de íconos SVG (`Icons.jsx`) y una barra superior con avatar (`Topbar.jsx`).
* Revisión y depuración de código existente para detectar y corregir errores puntuales, entre ellos:

  * Corrección del campo **"Nombre completo"** en `UserFormModal.jsx`, que no almacenaba correctamente la información debido a una diferencia entre el atributo `name` del input y la clave utilizada en el estado.
  * Corrección de la tabla de `UsersPage.jsx`, que intentaba mostrar `user.name` en lugar de `user.full_name`, que es el campo entregado por la API.
  * Corrección de la función `getUsers()` en `userService.js`, donde se utilizaba una variable no definida al manejar errores, generando un `ReferenceError`.
  * Corrección de errores de importación ocasionados por diferencias entre mayúsculas y minúsculas en nombres de archivos (`coachService` y `memberService`), evitando problemas de compatibilidad en sistemas Linux.
* Apoyo en la validación del funcionamiento del frontend mediante pruebas con el backend proporcionado por el docente, verificando la correcta comunicación con los distintos endpoints de autenticación, usuarios, deportes, salas, asignaciones, horarios, clases, reservas y perfil.

## Aspectos no delegados a la IA

La inteligencia artificial no participó en:

* El desarrollo ni la modificación de la base de datos.
* El desarrollo del backend, ya que fue entregado por el docente.
* Las decisiones de arquitectura del proyecto, como la organización de carpetas, rutas o definición de roles.
* La implementación de la lógica de negocio del sistema.
* La comprensión del funcionamiento de la aplicación ni la preparación para su defensa técnica.

## Declaración

La inteligencia artificial fue utilizada únicamente como una herramienta de apoyo para mejorar la interfaz, revisar código y detectar errores específicos. El desarrollo, integración y comprensión del funcionamiento del proyecto fueron realizados por el estudiante, quien comprende la comunicación entre el frontend y la API, el manejo de estados, las validaciones de formularios y la lógica de los flujos implementados, estando en condiciones de explicar técnicamente cualquier parte del sistema durante la evaluación.
