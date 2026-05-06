# Project

## 1. Descripción del sistema

Sistema web para la gestión de eventos académicos (cursos, congresos, jornadas, charlas). Permite a organizadores crear eventos, gestionar participantes y generar reportes, mientras que los usuarios pueden registrarse, inscribirse y participar en los eventos.

El sistema cubre el flujo completo:

* Registro de usuarios
* Creación y publicación de eventos
* Inscripción de participantes
* Acreditación
* Generación de certificados
* Encuestas y reportes post-evento

### Módulos del sistema

* Gestión de usuarios → specs/spec-usuarios.md
* Gestión de roles → specs/spec-roles.md
* Gestión de eventos → specs/spec-eventos.md
* Inscripciones → specs/spec-inscripciones.md

---

## 2. Stack tecnológico (no negociable)

Estas decisiones aplican a todos los módulos. Ninguna spec puede contradecirlas.

### Frontend

* Framework: React 18 con Vite
* Estilos: Tailwind CSS (sin librerías de componentes externas)
* Validaciones: Zod
* HTTP: fetch nativo
* Routing: React Router v6

### Backend

* Runtime: Node.js 20 LTS
* Framework: Express 4
* Validaciones: Zod (en middlewares)
* Arquitectura: controllers → services → repositories

### Base de datos

* Motor: PostgreSQL
* ORM: Prisma
* Esquema único compartido
* Migraciones controladas (no modificar BD manualmente)

### API

* Estilo: REST
* Formato: JSON

### Testing

* Framework: Vitest
* Cobertura mínima:

  * Caso exitoso
  * Al menos 2 casos de error por endpoint

---

## 3. Estructura del repositorio

### Backend

```
src/
  controllers/    ← Manejo de requests HTTP
  services/       ← Lógica de negocio
  repositories/   ← Acceso a datos
  routes/         ← Definición de endpoints
  middlewares/    ← Validaciones con Zod
```

### Frontend

```
src/
  pages/          ← Pantallas principales
  components/     ← Componentes reutilizables
  services/       ← Llamadas a la API
  hooks/          ← Lógica reutilizable
```

---

## 4. Convenciones de código

* Variables y funciones: camelCase
  Ej: userId, crearEvento()

* Tablas en base de datos: snake_case
  Ej: eventos_academicos

* Nombres de endpoints: en inglés y en plural
  Ej: /events, /users

---

## 5. Formato estándar de respuestas HTTP

Todos los endpoints deben responder con esta estructura:

### Respuesta exitosa

```json
{
  "data": {},
  "error": null,
  "message": "Operación exitosa"
}
```

### Respuesta con error

```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "fields": {}
  },
  "message": "Descripción del error"
}
```

### Códigos HTTP

| Código | Uso                        |
| ------ | -------------------------- |
| 200    | Operación exitosa          |
| 201    | Recurso creado             |
| 400    | Error de validación        |
| 404    | No encontrado              |
| 409    | Conflicto (ej: duplicados) |
| 422    | Error de negocio           |
| 500    | Error interno              |

---

## 6. Modelos de datos compartidos

Estos modelos deben ser utilizados por todos los módulos.

### Usuario

* id
* nombre
* email (único)
* password
* rol_principal
* creado_en
* actualizado_en

---

### Evento

* id
* nombre
* tipo (curso, jornada, congreso, charla)
* fecha
* fecha_limite_inscripcion
* cupo_minimo
* cupo_maximo
* estado (futuro, activo, finalizado)
* creado_por (usuario)

---

### Inscripción

* id
* usuario_id
* evento_id
* fecha_inscripcion
* estado (inscripto, cancelado, acreditado)

---

### Certificado

* id
* usuario_id
* evento_id
* tipo (asistencia, aprobación, expositor)
* fecha_emision

---

## 7. Reglas globales del sistema

* Un usuario puede inscribirse a múltiples eventos
* Un evento puede tener múltiples participantes
* No se permiten inscripciones fuera de la fecha límite
* No se pueden superar los cupos máximos
* Un evento debe tener fecha futura al momento de crearse
* Los eventos pueden ser filtrados por estado (futuro/pasado)

---

## 8. Roles del sistema

| Rol          | Descripción              |
| ------------ | ------------------------ |
| Participante | Se inscribe a eventos    |
| Organizador  | Crea y gestiona eventos  |
| Disertante   | Participa como expositor |

Para esta práctica:

* No se requiere autenticación real
* El rol se selecciona manualmente

---

## 9. Dependencias aprobadas

* Backend:

  * express
  * prisma
  * zod

* Frontend:

  * react
  * react-router
  * tailwind

No se permite:

* Axios
* Librerías UI externas
* Frameworks alternativos

---

## 10. Consideraciones de SDD

* Todas las specs deben respetar este documento
* No se pueden redefinir modelos ya existentes
* No se pueden cambiar endpoints definidos en Contracts.md
* Cada módulo debe ser independiente pero compatible con el resto
