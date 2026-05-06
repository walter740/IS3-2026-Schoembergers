# Contracts

Este archivo define las interfaces públicas de cada módulo: qué expone, qué consume y qué eventos emite.

Es un documento compartido y obligatorio para todos los integrantes.

Regla:
Si un módulo necesita cambiar algo que otro consume, primero se actualiza este archivo y se acuerda con el equipo.
Nunca modificar contratos de forma unilateral.

---

## Sección 1 — DTOs compartidos

Un módulo nunca expone directamente los modelos de base de datos.
Siempre devuelve DTOs (objetos simplificados y controlados).

---

### UsuarioResumen

Usado cuando otros módulos necesitan información básica del usuario.

```json
UsuarioResumen {
  id: number
  nombre: string
  email: string
  rol: string
}
```

---

### EventoResumen

Usado cuando se necesita listar eventos sin todos los detalles.

```json
EventoResumen {
  id: number
  nombre: string
  tipo: string
  fecha: string // ISO 8601
  estado: string
}
```

---

### InscripcionResumen

```json
InscripcionResumen {
  id: number
  usuario: UsuarioResumen
  evento: EventoResumen
  estado: string
  fechaInscripcion: string
}
```

---

## Sección 2 — Catálogo de endpoints públicos por módulo

---

### M1 — Usuarios

#### POST /api/users

Crea un usuario.

Request:

```json
{
  "nombre": "Juan",
  "email": "juan@mail.com",
  "password": "1234"
}
```

Response:

```json
{
  "data": {
    "id": 1,
    "email": "juan@mail.com"
  },
  "error": null,
  "message": "Usuario creado"
}
```

---

#### GET /api/users/:id

Devuelve datos de un usuario.

Response:

```json
{
  "data": {
    "id": 1,
    "nombre": "Juan",
    "email": "juan@mail.com",
    "rol": "PARTICIPANTE"
  },
  "error": null,
  "message": "OK"
}
```

---

### M2 — Eventos

#### GET /api/events

Devuelve listado de eventos.

Query params:

* estado (futuro | pasado)
* tipo

Response:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Congreso IA",
      "tipo": "congreso",
      "fecha": "2026-06-10",
      "estado": "futuro"
    }
  ],
  "error": null,
  "message": "OK"
}
```

---

#### POST /api/events

Crea un evento.

Request:

```json
{
  "nombre": "Curso de React",
  "tipo": "curso",
  "fecha": "2026-07-01",
  "cupo_maximo": 50
}
```

Response:

```json
{
  "data": {
    "id": 10
  },
  "error": null,
  "message": "Evento creado"
}
```

---

#### GET /api/events/:id

Detalle de un evento.

Response:

```json
{
  "data": {
    "id": 1,
    "nombre": "Congreso IA",
    "tipo": "congreso",
    "fecha": "2026-06-10",
    "cupo_maximo": 100,
    "estado": "futuro"
  },
  "error": null,
  "message": "OK"
}
```

---

### M3 — Inscripciones

#### POST /api/inscripciones

Inscribe un usuario a un evento.

Request:

```json
{
  "usuarioId": 1,
  "eventoId": 2
}
```

Response:

```json
{
  "data": {
    "id": 20,
    "estado": "inscripto"
  },
  "error": null,
  "message": "Inscripción realizada"
}
```

---

#### GET /api/inscripciones?eventoId=

Lista inscripciones de un evento.

Response:

```json
{
  "data": [
    {
      "id": 20,
      "usuario": { "...": "UsuarioResumen" },
      "estado": "inscripto"
    }
  ],
  "error": null,
  "message": "OK"
}
```

---

### M4 — Certificados

#### POST /api/certificados/generar

Genera certificado para un usuario.

Request:

```json
{
  "usuarioId": 1,
  "eventoId": 2,
  "tipo": "asistencia"
}
```

Response:

```json
{
  "data": {
    "certificadoId": 5
  },
  "error": null,
  "message": "Certificado generado"
}
```

---

## Sección 3 — Eventos entre módulos

Los eventos representan acciones importantes que un módulo notifica a otro.

Para esta práctica:

* Se implementan como llamadas HTTP entre módulos
* No usar frontend para esto

---

### EVT-01: Usuario inscrito a evento

Origen: M3 — Inscripciones
Destino: M2 — Eventos

Cuando un usuario se inscribe, el módulo de eventos debe actualizar el cupo disponible.

// M3 realiza:
POST /api/events/actualizar-cupo

```json
{
  "eventoId": 2
}
```

---

### EVT-02: Evento finalizado

Origen: M2 — Eventos
Destino: M4 — Certificados

Cuando un evento finaliza, se habilita la generación de certificados.

// M2 realiza:
POST /api/certificados/habilitar

```json
{
  "eventoId": 2
}
```

---

### EVT-03: Usuario acreditado

Origen: M3 — Inscripciones
Destino: M4 — Certificados

Cuando un usuario es acreditado, puede recibir certificado.

// M3 realiza:
POST /api/certificados/generar

```json
{
  "usuarioId": 1,
  "eventoId": 2,
  "tipo": "asistencia"
}
```
