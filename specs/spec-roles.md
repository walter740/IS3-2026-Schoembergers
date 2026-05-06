# Spec: Gestión de Roles

## 1. Objetivo y Contexto

Este módulo permite gestionar los roles de los usuarios dentro del sistema de eventos académicos.

Los roles determinan las acciones que cada usuario puede realizar dentro de la plataforma, como crear eventos, inscribirse o participar como disertante.

Este módulo es transversal a todo el sistema, ya que condiciona el comportamiento de otros módulos como eventos e inscripciones.

---

## 2. Historias de Usuario y Criterios de Aceptación

### Historia 1

**Como** organizador
**Quiero** tener permisos para crear y gestionar eventos
**Para** poder administrar actividades académicas

**Criterios de aceptación:**

* Dado que el usuario tiene rol organizador
* Cuando accede a funcionalidades de eventos
* Entonces el sistema debe permitir la operación

---

### Historia 2

**Como** participante
**Quiero** inscribirme a eventos
**Para** poder asistir

**Criterios de aceptación:**

* Dado que el usuario tiene rol participante
* Cuando intenta inscribirse
* Entonces el sistema debe permitir la inscripción

---

### Historia 3

**Como** sistema
**Quiero** validar los permisos según el rol
**Para** restringir accesos indebidos

**Criterios de aceptación:**

* Dado que un usuario no tiene rol organizador
* Cuando intenta crear un evento
* Entonces el sistema debe rechazar la operación

---

## 3. Requisitos Funcionales y Reglas de Negocio

### Requisitos funcionales

* El sistema debe permitir asignar un rol a un usuario
* El sistema debe permitir consultar el rol de un usuario
* El sistema debe validar permisos antes de ejecutar acciones
* El sistema debe permitir múltiples roles por usuario

---

### Reglas de negocio

* Un usuario debe tener al menos un rol
* Un usuario puede tener más de un rol
* Los roles válidos son: PARTICIPANTE, ORGANIZADOR, DISERTANTE
* No se permiten roles fuera del catálogo definido
* Los permisos deben evaluarse antes de ejecutar cualquier acción crítica

---

## 4. Restricciones técnicas específicas de este módulo

* Validación de roles mediante middlewares
* No se permite lógica de autorización en controllers
* Los roles deben ser definidos como constantes o enum
* Debe integrarse con el módulo de usuarios
* Debe respetar los roles definidos en Project.md

---

## 5. Modelo de datos de este módulo

Entidad: Rol

* id
* nombre (PARTICIPANTE, ORGANIZADOR, DISERTANTE)

---

Relación Usuario-Rol:

* usuario_id
* rol_id

---

Relaciones:

* Un usuario puede tener múltiples roles
* Un rol puede pertenecer a múltiples usuarios

---

## 6. Plan de Tareas

1. Definir estructura de roles (enum o tabla)
2. Implementar asignación de roles a usuarios
3. Implementar consulta de roles por usuario
4. Crear middleware de autorización
5. Integrar validación de roles en endpoints
6. Implementar capa service para lógica de permisos
7. Crear tests del módulo

---

## 7. Estrategia de Verificación

* Test de asignación de rol a usuario
* Test de usuario con múltiples roles
* Test de acceso permitido según rol
* Test de acceso denegado sin permisos
* Test de validación de roles inválidos
