## 1. Objetivo y Contexto

### Objetivo

El módulo de eventos tiene como objetivo principal gestionar el ABM (Alta, Baja, Modificación) de eventos académicos dentro del sistema de gestión de eventos académicos.

### Contexto

Este módulo forma parte de un sistema web que permite a organizadores crear y gestionar eventos académicos, mientras que los participantes pueden inscribirse y participar. Los usuarios principales son los organizadores (que administran los eventos) y los participantes (que se registran, ya sea de forma autónoma o asistidos por el personal del evento).

El módulo resuelve necesidades como evitar sobrecupos, controlar fechas límite de inscripción, clasificar eventos por tipo (curso, jornada, congreso, charla), e informar el estado de los eventos (futuro, activo, finalizado).

## 2. Historias de Usuario y Criterios de Aceptación

### HU1: Como organizador, quiero crear un evento para publicar nuevos eventos académicos.

**Criterios de Aceptación:**
- El formulario debe incluir campos obligatorios: nombre, tipo (curso/jornada/congreso/charla), fecha, cupo máximo.
- Validar que el nombre no esté vacío y sea único.
- La fecha debe ser futura (mayor a la fecha actual).
- El cupo máximo debe ser un número entero positivo.
- Al crear, asignar estado "futuro" y registrar el usuario creador.
- Respuesta exitosa: devolver ID del evento creado.

### HU2: Como organizador, quiero editar un evento para actualizar detalles antes de que comience.

**Criterios de Aceptación:**
- Solo permitir edición de eventos con estado "futuro" o "activo".
- Campos editables: nombre, tipo, fecha, cupo máximo (si no supera inscripciones actuales).
- Validaciones iguales a HU1 para los campos modificados.
- No permitir cambiar fecha a pasada ni reducir cupo por debajo de inscripciones activas.
- Actualizar fecha de modificación.

### HU3: Como organizador, quiero eliminar un evento para cancelar eventos no realizados.

**Criterios de Aceptación:**
- Solo permitir eliminación de eventos con estado "futuro".
- No permitir si hay inscripciones activas (estado "inscripto" o "acreditado").
- Al eliminar, marcar como inactivo o remover de la base de datos (según política).

### HU4: Como participante, quiero listar eventos disponibles para elegir cuáles inscribirme.

**Criterios de Aceptación:**
- Mostrar lista de eventos con estado "futuro" o "activo".
- Incluir filtros opcionales: por tipo, por fecha.
- Cada evento mostrar: ID, nombre, tipo, fecha, estado.
- Ordenar por fecha ascendente.

### HU5: Como organizador, quiero ver el detalle de un evento para gestionar información específica.

**Criterios de Aceptación:**
- Mostrar todos los campos del evento: ID, nombre, tipo, fecha, fecha límite inscripción, cupo mínimo, cupo máximo, estado, creado por.
- Solo organizadores pueden acceder al detalle de cualquier evento; participantes solo a eventos públicos.

## 3. Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales

#### Crear Evento (POST /api/events)
- **Funcionalidad**: Permite a un Organizador dar de alta un nuevo evento académico.
- **Validaciones**: Uso obligatorio de Zod para verificar que el cuerpo de la petición contenga nombre, tipo, fecha y cupo_maximo.
- **Respuesta**: Formato estándar de proyect.md, con data conteniendo el ID del evento creado.

#### Listar Eventos (GET /api/events)
- **Funcionalidad**: Recupera una lista de eventos simplificados (EventoResumen).
- **Filtros**: Debe permitir filtrar por estado (futuro | pasado) y tipo (curso, congreso, jornada, charla).
- **Respuesta**: Array de EventoResumen en data.

#### Obtener Detalle (GET /api/events/:id)
- **Funcionalidad**: Devuelve toda la información detallada de un evento específico para su visualización completa.
- **Respuesta**: Objeto completo del evento en data.

#### Editar Evento (PUT /api/events/:id)
- **Funcionalidad**: Permite modificar datos de un evento existente (ej. cambiar el cupo o la fecha).
- **Validaciones**: Zod para campos modificados, respetando reglas de negocio.
- **Respuesta**: Confirmación de actualización.

#### Eliminar/Cancelar Evento (DELETE /api/events/:id)
- **Funcionalidad**: Remoción lógica o física de un evento que aún no ha sucedido.
- **Respuesta**: Confirmación de eliminación.

### Reglas de Negocio

- **Estado Automático**: El sistema debe calcular el estado (futuro, activo, finalizado) comparando la fecha del evento con la fecha actual del servidor.
- **Validación de Fechas**: Un evento debe tener una fecha futura al momento de su creación. La fecha_limite_inscripcion debe ser anterior o igual a la fecha de realización del evento.
- **Gestión de Cupos**: El cupo_maximo no puede ser menor al cupo_minimo. No se pueden permitir inscripciones si el número de inscritos actuales es igual al cupo_maximo.
- **Restricción de Roles**: Solo usuarios con el rol de Organizador pueden ejecutar POST, PUT o DELETE sobre eventos.

### Manejo de Errores y Excepciones

- **Error 400 (Bad Request)**: Cuando las validaciones de Zod fallan (ej: nombre vacío, fecha mal formateada).
- **Error 404 (Not Found)**: Cuando se intenta acceder, editar o eliminar un ID de evento que no existe en la base de datos.
- **Error 409 (Conflict)**: Cuando se intenta inscribir a alguien y el cupo está lleno. Si se intenta crear un evento con una fecha pasada.
- **Error 422 (Unprocessable Entity)**: Para errores de lógica de negocio, como intentar finalizar un evento que aún no ha ocurrido.

### Integraciones y Dependencias

- **Módulo de Usuarios (M1)**: Para verificar que el creado_por (ID de usuario) existe y tiene los permisos adecuados.
- **Módulo de Inscripciones (M3 - EVT-01)**: El módulo de eventos debe exponer el endpoint POST /api/events/actualizar-cupo para que M3 le notifique cada vez que un nuevo usuario se registra, permitiendo recalcular el cupo disponible.
- **Módulo de Certificados (M4 - EVT-02)**: Al finalizar un evento, M2 debe notificar a M4 mediante POST /api/certificados/habilitar para que los participantes puedan empezar a emitir sus certificados.

## 4. Restricciones Técnicas

### Restricciones del Backend

- **Runtime y Framework**: Se debe utilizar exclusivamente Node.js 20 LTS con el framework Express 4.
- **Arquitectura de Software**: Es obligatorio seguir el flujo de capas controllers → services → repositories para la organización del código.
- **Validaciones**: Todas las validaciones en la capa de middleware deben implementarse utilizando Zod.
- **Dependencias Permitidas**: Solo se autoriza el uso de express, prisma y zod. Queda expresamente prohibido el uso de Axios u otros frameworks alternativos.

### Restricciones del Frontend

- **Framework y Herramientas**: Uso de React 18 con Vite como herramienta de construcción.
- **Estilos y UI**: Se debe emplear Tailwind CSS. Está estrictamente prohibido el uso de librerías de componentes externas (como Material UI o Flowbite).
- **Comunicación y Routing**: Las peticiones HTTP deben realizarse mediante fetch nativo (sin Axios) y la navegación debe gestionarse con React Router v6.
- **Validación de Formularios**: Se debe integrar Zod para las validaciones en el cliente.

### Limitaciones de Base de Datos y API

- **Motor y ORM**: El sistema utiliza PostgreSQL gestionado a través de Prisma.
- **Gestión de Datos**: Se debe trabajar con un esquema único compartido y todas las modificaciones deben realizarse mediante migraciones controladas, prohibiendo cambios manuales en la base de datos.
- **Estilo de API**: Los endpoints deben seguir el estilo REST con formato de intercambio de datos en JSON.
- **Estandarización de Respuestas**: Todas las respuestas deben seguir la estructura definida en el proyecto, incluyendo objetos de data, error y message, respetando los códigos HTTP estándar (200, 201, 400, 404, 409, 422, 500).

### Testing y Convenciones de Código

- **Framework de Pruebas**: Se debe utilizar Vitest.
- **Cobertura Mínima por Endpoint**: Cada endpoint requiere obligatoriamente: Un (1) caso de éxito. Al menos dos (2) casos de error documentados y probados.
- **Convenciones de Nomenclatura**: Código (Variables y funciones): Utilizar camelCase (ej: userId, crearEvento). Base de Datos (Tablas): Utilizar snake_case (ej: eventos_academicos). Endpoints: Deben estar escritos en inglés y en plural (ej: /events, /users).

## 5. Modelo de Datos del Módulo

### Entidades Principales

- **Evento**: Entidad central que gestiona toda la información del evento académico.
- **Usuario**: Entidad relacionada necesaria para identificar al organizador mediante el campo creado_por.
- **Inscripción**: Entidad relacionada consultada para el cálculo de cupos y disponibilidad.

### Atributos del Modelo de Evento

- `id`: Identificador único.
- `nombre`: Título del evento.
- `tipo`: Enumeración (curso, jornada, congreso, charla).
- `fecha`: Fecha de realización (ISO 8601).
- `fecha_limite_inscripcion`: Fecha tope para registrarse.
- `cupo_minimo`: Mínimo de asistentes requeridos.
- `cupo_maximo`: Límite máximo de participantes.
- `estado`: Calculado automáticamente (futuro, activo, finalizado).
- `creado_por`: ID del usuario con rol de organizador.

### DTOs para las respuestas de la API

- **EventoResumen**: Utilizado en el listado (GET /api/events). Incluye: `id`, `nombre`, `tipo`, `fecha`, `estado`.
- **EventoDetalle**: Utilizado para el detalle específico (GET /api/events/:id). Incluye todos los campos de la entidad, incluyendo los límites de cupo y la información del organizador.
- **RespuestaEstándar**: Envoltorio para todas las respuestas con los campos `data`, `error` y `message`.

### Relaciones e Integraciones

- **Relación Usuario-Evento**: El campo `creado_por` es una clave foránea que referencia al modelo `Usuario` para validar permisos de edición.
- **Integración con Inscripciones**: Para validar la regla de "No superar cupos máximos", el módulo de eventos debe recibir notificaciones del módulo de Inscripciones (M3) para actualizar el contador de cupos en tiempo real.
- **Regla de Negocio**: La creación de un evento requiere una validación lógica donde la fecha debe ser mayor a la fecha actual.

## 6. Plan de Tareas

### Backend
- Definir esquema Prisma para `Evento` y sus relaciones con `Usuario` e `Inscripcion`.
- Implementar rutas en `routes/events.ts`:
  - `GET /api/events`
  - `GET /api/events/:id`
  - `POST /api/events`
  - `PUT /api/events/:id`
  - `DELETE /api/events/:id`
  - `POST /api/events/actualizar-cupo`
- Crear validaciones Zod en `middlewares/eventValidation.ts` para cada endpoint.
- Desarrollar controllers con respuestas estándar.
- Implementar servicios y repositorios para la lógica de estados, cupos y permisos.
- Añadir notificaciones a certificado y validación de creado_por con el módulo Usuarios.

### Frontend
- Diseñar página de listado de eventos con filtros por tipo y estado.
- Implementar formulario de creación/edición de eventos con validaciones Zod.
- Crear vista de detalle de evento que muestre toda la información relevante.
- Consumir API REST con `fetch` nativo.
- Usar React Router v6 para las rutas de eventos.

### Pruebas
- Crear tests de Vitest para cada endpoint del backend.
- Asegurar al menos un caso de éxito y dos casos de error por endpoint.
- Probar validaciones Zod en los middlewares.
- Documentar errores esperados y respuestas estándar.

## 7. Estrategia de Verificación

- **Verificación de Historia de Usuario**: Cada HU debe cumplir sus criterios con pruebas manuales y automáticas.
- **Pruebas Backend**:
  - Validar `POST /api/events` con datos válidos y errores de validación.
  - Verificar `GET /api/events` con filtros y formatos de respuesta.
  - Probar `GET /api/events/:id` para evento existente y no existente.
  - Probar `PUT /api/events/:id` para actualización válida y errores de estado/cupo.
  - Probar `DELETE /api/events/:id` para eliminación válida y rechazo por inscripciones.
- **Pruebas de Integración**:
  - Simular notificación de M3 a `POST /api/events/actualizar-cupo`.
  - Simular notificación a M4 al finalizar evento.
- **Criterios de Aceptación**:
  - Todas las respuestas usan formato estándar `data/error/message`.
  - Se respetan los códigos HTTP definidos: 200, 201, 400, 404, 409, 422, 500.
  - No se exponen modelos internos en las respuestas, solo DTOs.
- **Revisión de Código**:
  - Confirmar uso de camelCase en código y snake_case en tablas.
  - Verificar que no se usen dependencias prohibidas (Axios, UI libs).
