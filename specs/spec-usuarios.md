# Spec: Gestión de Usuarios

## 1. Objetivo y Contexto

Este módulo permite la creación y gestión de usuarios dentro de la plataforma de eventos académicos.

Es fundamental para el sistema, ya que todos los demás módulos (eventos, inscripciones, certificados) dependen de la existencia de usuarios registrados.

Los usuarios podrán registrarse de forma autónoma para participar en eventos.

---

## 2. Historias de Usuario y Criterios de Aceptación

### Historia 1

**Como** usuario
**Quiero** registrarme en la plataforma
**Para** poder inscribirme a eventos

**Criterios de aceptación:**

* Dado que ingreso mis datos correctamente
* Cuando confirmo el registro
* Entonces el sistema debe crear mi usuario

---

### Historia 2

**Como** sistema
**Quiero** validar los datos del usuario
**Para** evitar registros inválidos

**Criterios de aceptación:**

* Dado que el usuario ingresa un email inválido
* Cuando intenta registrarse
* Entonces el sistema debe rechazar la operación

---

### Historia 3

**Como** usuario
**Quiero** consultar mis datos
**Para** verificar mi información registrada

**Criterios de aceptación:**

* Dado que el usuario existe
* Cuando solicita su información
* Entonces el sistema devuelve sus datos

---

## 3. Requisitos Funcionales y Reglas de Negocio

### Requisitos funcionales

* El sistema debe permitir crear usuarios
* El sistema debe permitir consultar usuarios por ID
* El sistema debe validar email único
* El sistema debe almacenar contraseña

---

### Reglas de negocio

* No se permiten emails duplicados
* El email debe tener formato válido
* La contraseña debe tener una longitud mínima
* Un usuario debe tener al menos un rol asignado

---

## 4. Restricciones técnicas específicas de este módulo

* Debe implementarse como API REST
* Validaciones realizadas con Zod
* No se permite lógica de negocio en controllers
* Debe respetar DTO UsuarioResumen definido en Contracts.md
* Debe respetar estructura de respuesta definida en Project.md

---

## 5. Modelo de datos de este módulo

Entidad: Usuario

* id
* nombre
* email
* password
* rol_principal
* creado_en
* actualizado_en

Relaciones:

* Un usuario puede tener múltiples inscripciones
* Un usuario puede recibir certificados

---

## 6. Plan de Tareas

1. Definir modelo de usuario en base de datos
2. Implementar endpoint POST /api/users
3. Implementar endpoint GET /api/users/:id
4. Implementar validaciones con Zod
5. Crear capa service con lógica de negocio
6. Implementar repository para persistencia
7. Crear tests del módulo

---

## 7. Estrategia de Verificación

* Test de creación de usuario válido
* Test de rechazo por email duplicado
* Test de validación de formato de email
* Test de obtención de usuario por ID
* Test de error cuando el usuario no existe
..