## 1. Objetivo y Contexto

### Objetivo

El módulo de inscripciones tiene como objetivo permitir a los participantes registrar su asistencia a eventos académicos y gestionar el estado de su inscripción de manera segura y consistente.

### Contexto

Este módulo forma parte de un sistema web para la gestión de eventos académicos, donde los usuarios registrados pueden inscribirse en eventos organizados por el personal. El módulo debe coordinarse con los módulos de Usuarios y Eventos para validar identidad, permisos y disponibilidad de cupo.

El módulo resuelve necesidades como:

* Registrar inscripciones dentro de los plazos establecidos.
* Evitar duplicados y sobrecupos.
* Permitir cancelar inscripciones y acreditar participantes.
* Exponer inscripciones en un formato controlado mediante DTOs.

## 2. Historias de Usuario y Criterios de Aceptación

### HU1: Como participante, quiero inscribirme en un evento para asegurar mi lugar.

**Criterios de Aceptación:**
- El endpoint debe recibir `usuario_id` y `evento_id`.
- Solo se permite inscribirse si el evento existe, está en estado `futuro` o `activo`, y la fecha límite de inscripción no ha pasado.
- No se permite inscribir si el cupo máximo ya está completo.
- No se permite crear inscripciones duplicadas para el mismo usuario y evento.
- La respuesta debe devolver un `InscripcionResumen` con `id`, `usuario`, `evento`, `estado` y `fechaInscripcion`.
- En caso de éxito, devolver código HTTP `201`.

### HU2: Como participante, quiero ver mis inscripciones para conocer en qué eventos estoy registrado.

**Criterios de Aceptación:**
- El endpoint debe listar todas las inscripciones del usuario autenticado o de un usuario indicado si el solicitante tiene permisos.
- Debe devolver un arreglo de `InscripcionResumen`.
- Debe permitir filtrar por `estado` (inscripto | cancelado | acreditado).
- Debe devolver `200` con `data` no nulo.

### HU3: Como participante, quiero cancelar mi inscripción para liberar un cupo si ya no puedo asistir.

**Criterios de Aceptación:**
- Solo se puede cancelar una inscripción en estado `inscripto`.
- La cancelación debe registrar el cambio de estado a `cancelado`.
- El sistema debe liberar el cupo para que otro usuario pueda inscribirse.
- La respuesta debe devolver `200` y el resumen actualizado.
- Si el evento ya está finalizado o la inscripción está acreditada, no se permite cancelar.

### HU4: Como organizador, quiero acreditar a un participante para reconocer su presencia.

**Criterios de Aceptación:**
- Solo se puede acreditar una inscripción que esté en estado `inscripto` y cuyo evento haya finalizado o esté activo según definición de negocio.
- El estado debe cambiar a `acreditado`.
- El endpoint debe devolver `200` y el resumen actualizado.
- Debe existir validación de permisos de rol.

## 3. Requisitos Funcionales y Reglas de Negocio

### Requisitos Funcionales

#### POST /api/registrations
- Permite crear una nueva inscripción.
- Valida cuerpo con Zod: `usuario_id`, `evento_id`.
- Devuelve `InscripcionResumen` en la respuesta estándar.

#### GET /api/registrations
- Lista inscripciones generales, con filtros opcionales por `usuario_id`, `evento_id` y `estado`.
- Devuelve array de `InscripcionResumen`.

#### GET /api/registrations/:id
- Recupera el detalle de una inscripción.
- Devuelve un solo `InscripcionResumen`.

#### PUT /api/registrations/:id/cancel
- Permite cancelar una inscripción activa.
- Cambia estado a `cancelado`.

#### PUT /api/registrations/:id/accredit
- Permite acreditar una inscripción elegible.
- Cambia estado a `acreditado`.

### Reglas de Negocio

- Una inscripción tiene estado: `inscripto`, `cancelado` o `acreditado`.
- No se permiten inscripciones si la `fecha_limite_inscripcion` del evento ha pasado.
- No se permiten inscripciones si el evento ya alcanzó `cupo_maximo`.
- No se permiten inscripciones duplicadas para el mismo `usuario_id` y `evento_id`.
- El evento debe existir y estar en estado `futuro` o `activo` al momento de la inscripción.
- La cancelación solo es posible si la inscripción está en estado `inscripto`.
- La acreditación solo es posible si la inscripción está en estado `inscripto` y el evento cumple condiciones de finalización/monitor.
- Las respuestas deben seguir el formato estándar: `data`, `error`, `message`.

### Excepciones y Manejo de Errores

- `400 Bad Request`: Validaciones de Zod fallidas o parámetros inválidos.
- `404 Not Found`: `usuario`, `evento` o `inscripción` no encontrados.
- `409 Conflict`: Inscripción duplicada o cupo agotado.
- `422 Unprocessable Entity`: Reglas de negocio violadas (fecha límite pasada, cancelación inválida, acreditación inválida).

### Integración con Contratos

- El módulo no debe exponer directamente el modelo de base de datos; debe devolver `InscripcionResumen` según `Contracts.md`.
- El módulo debe consumir `UsuarioResumen` y `EventoResumen` cuando devuelva `InscripcionResumen`.
- Si el módulo necesita exponer nuevos DTOs públicos, debe actualizar `Contracts.md` en acuerdo con el equipo.

## 4. Restricciones Técnicas

### Backend

- Runtime: Node.js 20 LTS.
- Framework: Express 4.
- Validaciones de request: Zod en middleware.
- Arquitectura: controllers → services → repositories.
- ORM: Prisma con esquema compartido.
- No modificar BD manualmente: todas las estructuras deben crearse con migraciones Prisma.
- Endpoints REST en inglés y plural: `/api/registrations`.
- Respuestas JSON con estructura estándar.

### Frontend

- Framework: React 18 con Vite.
- Estilos: Tailwind CSS sin librerías de componentes externas.
- HTTP: fetch nativo.
- Routing: React Router v6.
- Validaciones de formularios: Zod.

### Testing

- Framework: Vitest.
- Cada endpoint debe tener al menos 1 caso de éxito y 2 casos de error.
- Probar validaciones de Zod y reglas de negocio.

## 5. Modelo de Datos del Módulo

### Entidad Inscripción

- `id`: number
- `usuario_id`: number
- `evento_id`: number
- `fecha_inscripcion`: string (ISO 8601)
- `estado`: string (`inscripto` | `cancelado` | `acreditado`)

### DTO público: InscripcionResumen

Según `Contracts.md`, debe contener:

- `id`
- `usuario`: `UsuarioResumen`
- `evento`: `EventoResumen`
- `estado`
- `fechaInscripcion`

### Relaciones y Validaciones

- `usuario_id` referencia al módulo de Usuarios para validar que exista el usuario.
- `evento_id` referencia al módulo de Eventos para validar disponibilidad de cupo, estado y fecha límite.
- La entidad no debe exponer el `usuario_id` y `evento_id` directamente en la respuesta pública, salvo que sean parte de DTOs controlados.

### Modelo Prisma sugerido

- Tabla: `registrations`
- Campos: `id`, `usuario_id`, `evento_id`, `fecha_inscripcion`, `estado`
- Índices: `unique(usuario_id, evento_id)` para evitar duplicados.
- Relaciones: `usuario` -> `users`, `evento` -> `events`.

## 6. Plan de Tareas

### Backend

1. Definir modelo Prisma `Registration` y migración.
2. Crear rutas en `routes/registrations.ts`:
   - `POST /api/registrations`
   - `GET /api/registrations`
   - `GET /api/registrations/:id`
   - `PUT /api/registrations/:id/cancel`
   - `PUT /api/registrations/:id/accredit`
3. Implementar validaciones Zod en `middlewares/registrationValidation.ts`.
4. Desarrollar `controllers/registrationsController.ts`.
5. Implementar `services/registrationService.ts` con la lógica de reglas de negocio.
6. Crear `repositories/registrationRepository.ts` para acceso Prisma.
7. Integrar con el servicio de Eventos para validar disponibilidad y actualizar cupos si aplica.
8. Añadir pruebas unitarias y de integración con Vitest.

### Frontend

1. Crear página `pages/RegistrationsList.jsx` para listar inscripciones.
2. Crear componente `components/RegistrationForm.jsx` para crear inscripciones.
3. Crear acciones y servicios en `services/registrationService.js` usando fetch.
4. Añadir rutas en React Router v6 para la vista de inscripciones.
5. Implementar validaciones Zod en el formulario de inscripción.
6. Manejar mensajes de error de la API y mostrar el estado de la inscripción.

### Testing

1. Escribir tests para `POST /api/registrations`:
   - éxito
   - error por cupo lleno
   - error por evento cerrado o fecha límite pasada
2. Escribir tests para `GET /api/registrations`:
   - listado exitoso con filtros
   - error por parámetros inválidos
3. Escribir tests para `GET /api/registrations/:id`:
   - existente
   - no existente
4. Escribir tests para `PUT /api/registrations/:id/cancel` y `PUT /api/registrations/:id/accredit`:
   - éxito
   - error por estado inválido
   - error por permisos o evento ya finalizado incorrectamente

## 7. Estrategia de Verificación

### Verificación Manual

- Crear inscripción con datos válidos y verificar respuesta `201`.
- Intentar inscribir con el cupo agotado y verificar `409`.
- Intentar inscribir después de la fecha límite y verificar `422`.
- Listar inscripciones y validar que devuelva `InscripcionResumen` con usuario y evento.
- Cancelar una inscripción y verificar que el estado cambie a `cancelado`.
- Acreditar una inscripción y verificar que el estado cambie a `acreditado`.

### Verificación Automatizada

- Ejecutar suite de Vitest para inscripciones.
- Validar que cada endpoint cumpla con las reglas de negocio definidas.
- Confirmar que las respuestas siguen la estructura estándar del proyecto.

### Criterios de Aceptación Final

- La API de inscripciones debe cumplir con las historias de usuario.
- No deben existir inscripciones duplicadas.
- No debe permitirse superar cupo o inscribirse fuera de plazo.
- Las pruebas deben cubrir casos de éxito y errores esperados.
- La documentación debe respetar la estructura obligatoria indicada.
