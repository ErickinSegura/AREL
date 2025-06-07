# Análisis de Requerimientos

## Requerimientos Funcionales
| ID | Descripción | Prioridad |
|----|-------------|-----------|
| **Gestión de usuarios** |
| RFU1 | Creación de Cuenta: Registro de usuarios en la plataforma web con validación de datos. | Alta |
| RFU2 | Inicio de sesión: Inicio de sesión con autenticación basada en correo y contraseña. | Alta |
| RFU3 | Vinculación de cuenta: Vinculación de cuenta con Telegram para recibir respuestas personalizadas. | Alta |
| RFU4 | Personalización de avatar: Creación y edición del avatar del usuario desde el perfil personal. | Media |
| **Gestión de proyectos y sprints** |
| RFP1 | Proyectos activos: Lista de proyectos activos accesible desde la web y el bot. | Alta |
| RFP2 | Selección de proyecto: Selección de proyecto en el bot para trabajar con su backlog. | Alta |
| RFP3 | Creación de sprint: Creación de sprints con tareas específicas y fecha de finalización. | Alta |
| RFP4 | Finalización de sprints: Finalización de sprints con registro de la fecha de cierre. | Alta |
| RFP5 | Modificación de proyectos: Modificación de proyectos para actualizar información general. | Media |
| RFP6 | Visualización de backlog: Visualización de backlog con el estado de cada tarea. | Alta |
| **Gestión de tareas** |
| RFT1 | Creación de Tareas: Creación de tareas desde la web o el bot con información obligatoria (nombre, descripción, prioridad). | Alta |
| RFT2 | Edición de tareas: Edición de tareas en el portal y en el chatbot (estado, nombre, asignación, etc.). | Alta |
| RFT3 | Tareas Personales: Lista de tareas personales para desarrolladores. | Alta |
| RFT4 | Tareas Equipo: Lista de tareas del equipo visible por administradores. | Alta |
| RFT5 | Cambio de Estado Tareas: Cambio de estado de tareas desde el bot o la web (To Do, Doing, Done). | Alta |
| RFT6 | Asignación de tareas: Asignación de tareas a roles específicos. | Alta |
| RFT7 | Marcar Completado: Marcar tareas como completadas desde el bot. | Alta |
| RFT8 | Horas Estimadas de Completado: Agregar las horas estimadas para completar una tarea. | Media |
| **Visualización y Reportes** |
| RFV1 | Backlog: Gráficos de rendimiento del backlog y los sprints. | Media |
| RFV2 | Kanban: Tablero de tareas en la web con arrastrar y soltar (drag and drop). | Alta |
| RFV3 | Dashboard: Dashboard de desarrolladores con métricas personales. | Alta |
| RFV4 | Progreso Admin View: Dashboard de administradores con progreso de los proyectos. | Alta |
| RFV5 | Atajos View: Atajos a funciones clave en una vista de shortcuts. | Baja |

## Requerimientos No Funcionales
| ID | Tipo | Descripción | Prioridad |
|----|------|-------------|-----------|
| **Usabilidad** |
| RNFU1 | Usabilidad | Interfaz Clara: Interfaz intuitiva y clara tanto en la web como en el bot. | Alta |
| RNFU2 | Usabilidad | Comandos sencillos y entendibles: Comandos sencillos en el bot de Telegram para fácil interacción. | Alta |
| RNFU3 | Usabilidad | Respuestas entendibles: Respuestas rápidas y concisas en todas las interfaces. | Alta |
| **Seguridad** |
| RNFS1 | Seguridad | Contraseña cifrada: Cifrado de contraseñas y datos sensibles en la base de datos. | Alta |
| RNFS2 | Seguridad | Autenticación en roles: Autenticación basada en roles con permisos diferenciados (admin, dev). | Alta |
| RNFS3 | Seguridad | Protección SQL: Protección contra ataques de inyección SQL en los formularios. | Alta |
| **Rendimiento y Disponibilidad** |
| RNFR1 | Rendimiento | Tiempo de Respuesta: Tiempo de respuesta menor a 2 segundos en todas las acciones críticas. | Alta |
| RNFR2 | Rendimiento | Escalabilidad: Escalabilidad para manejar múltiples usuarios y proyectos sin degradación. | Alta |
| RNFR3 | Disponibilidad | Disponibilidad: Disponibilidad del bot 24/7, con reintentos en caso de fallos de conexión. | Alta |
| **Mantenibilidad y Escalabilidad** |
| RNFM1 | Mantenibilidad | Documentación: Código modular y documentado para facilitar mantenimiento. | Media |
| RNFM2 | Mantenibilidad | Definición de API: API bien definida para futuras integraciones con otras plataformas. | Alta |
| RNFM3 | Escalabilidad | Roles escalables: Soporte para agregar más roles o tipos de tareas en el futuro. | Media |
| **Configurabilidad** |
| RNFC1 | Configurabilidad | Notificaciones: Permitir activar/desactivar notificaciones según la preferencia del usuario. | Baja |
| RNFC2 | Configurabilidad | Vistas modulares personalizables: Personalización de vistas en el dashboard de la web. | Baja |
| **Infraestructura** |
| RNFI1 | Infraestructura | Uso de OCI: Se debe usar Oracle Cloud Infrastructure para controlar la arquitectura del sistema desde la nube. | Alta |
| RNFI2 | Infraestructura | Uso de OAD: Oracle Autonomous Database: Usar base de datos de Oracle Cloud para la gestión de la información del sistema. | Alta |
| RNFI3 | Infraestructura | Kubernetes: Uso de Kubernetes para la implementación del sistema mediante contenedores en la nube. | Alta |
| RNFI4 | Infraestructura | Docker: Uso de docker para la gestión de imágenes y contenedores para la aplicación. | Alta |
| RNFI5 | Infraestructura | REST API: Uso de REST API de Oracle para los medios de comunicación entre las partes del sistema. | Alta |
| **Desarrollo** |
| RNFD1 | Desarrollo | JAVA: Uso de java para la lógica del sistema. | Alta |
| RNFD2 | Desarrollo | Microservices: Uso de microservicios para las diferentes funcionalidades de la aplicación en la nube. | Alta |
| RNFD3 | Desarrollo | Spring Boot: Uso del framework de springboot para el desarrollo del backend y la integración con el resto del sistema. | Alta |
| RNFD4 | Desarrollo | API Gateway: Uso de API Gateway para la gestión de las API para el control de tráfico de información en el sistema. | Alta |
| RNFD5 | Desarrollo | Container Registry: Uso de OCI Container Registry para el despliegue de contenedores en la nube de Oracle. | Alta |
| **Operaciones** |
| RNFO1 | Operaciones | Manejo de Sprints: Automatizar los ciclos de desarrollo de cada sprint: Implementación de herramientas y procesos para optimizar el flujo de trabajo en cada iteración. | Alta |
| RNFO2 | Operaciones | CI/CD: Integración y despliegue continuo de software: Uso de CI/CD para asegurar entregas frecuentes y confiables. | Alta |
| RNFO3 | Operaciones | Infrastructure as Code: Aprovisionar ambientes de desarrollo con Infrastructure as Code. | Media |

## Historias de Usuario

### Gestión de Usuarios

### Historia de Usuario 1 - Registro de Usuario
**Como** nuevo usuario
**Quiero** crear una cuenta en la plataforma web
**Para** poder acceder al sistema de gestión de proyectos y tareas

**Criterios de Aceptación:**
- El sistema debe validar que el correo electrónico tenga un formato válido
- La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas y números
- El sistema debe verificar que el correo no esté registrado previamente
- Después del registro exitoso, el usuario debe recibir un correo de confirmación

### Historia de Usuario 2 - Inicio de Sesión
**Como** usuario registrado
**Quiero** iniciar sesión con mi correo y contraseña
**Para** acceder a mis proyectos y tareas personales

**Criterios de Aceptación:**
- El sistema debe autenticar las credenciales correctamente
- Si las credenciales son incorrectas, debe mostrar un mensaje de error claro
- Después del login exitoso, el usuario debe ser redirigido al dashboard principal
- El sistema debe mantener la sesión activa por un tiempo determinado

### Historia de Usuario 3 - Vinculación con Telegram
**Como** usuario registrado
**Quiero** vincular mi cuenta con Telegram
**Para** recibir notificaciones y poder gestionar tareas desde el bot

**Criterios de Aceptación:**
- El sistema debe generar un código único de vinculación
- El usuario debe poder ingresar este código en el bot de Telegram
- Una vez vinculado, el bot debe reconocer al usuario y sus permisos
- El usuario debe poder desvincular su cuenta cuando lo desee

### Historia de Usuario 4 - Personalización de Avatar
**Como** usuario registrado
**Quiero** crear y editar mi avatar desde mi perfil
**Para** personalizar mi experiencia en la plataforma

**Criterios de Aceptación:**
- El usuario debe poder subir una imagen como avatar
- El sistema debe redimensionar automáticamente la imagen al tamaño apropiado
- El usuario debe poder ver una vista previa antes de guardar
- El avatar debe mostrarse en todas las interfaces donde aparezca el usuario

### Gestión de Proyectos y Sprints

### Historia de Usuario 5 - Visualización de Proyectos Activos
**Como** usuario (desarrollador o administrador)
**Quiero** ver una lista de proyectos activos
**Para** seleccionar en cuál proyecto trabajar

**Criterios de Aceptación:**
- La lista debe mostrar solo proyectos en estado activo
- Cada proyecto debe mostrar nombre, descripción y fecha de inicio
- La lista debe estar disponible tanto en la web como en el bot
- Los proyectos deben estar ordenados por fecha de creación o prioridad

### Historia de Usuario 6 - Selección de Proyecto en Bot
**Como** desarrollador
**Quiero** seleccionar un proyecto específico en el bot de Telegram
**Para** trabajar con las tareas de ese proyecto

**Criterios de Aceptación:**
- El bot debe mostrar una lista de proyectos disponibles para el usuario
- El usuario debe poder seleccionar un proyecto mediante comandos o botones
- Una vez seleccionado, todas las operaciones del bot deben contextualizarse a ese proyecto
- El usuario debe poder cambiar de proyecto en cualquier momento

### Historia de Usuario 7 - Creación de Sprint
**Como** administrador de proyecto
**Quiero** crear sprints con tareas específicas y fecha de finalización
**Para** organizar el trabajo del equipo en iteraciones

**Criterios de Aceptación:**
- El sprint debe tener un nombre, descripción y fecha de finalización obligatorios
- Se debe poder asignar tareas existentes al sprint
- El sistema debe validar que la fecha de finalización sea futura
- El sprint debe aparecer en el backlog del proyecto

### Historia de Usuario 8 - Finalización de Sprint
**Como** administrador de proyecto
**Quiero** finalizar sprints y registrar la fecha de cierre
**Para** llevar un control del progreso y generar métricas

**Criterios de Aceptación:**
- Solo se pueden finalizar sprints que estén en progreso
- El sistema debe registrar automáticamente la fecha y hora de cierre
- Las tareas no completadas deben poder moverse al siguiente sprint
- Se debe generar un reporte automático del sprint finalizado

### Historia de Usuario 9 - Modificación de Proyectos
**Como** administrador de proyecto
**Quiero** modificar la información general de los proyectos
**Para** mantener actualizada la información del proyecto

**Criterios de Aceptación:**
- Se debe poder editar nombre, descripción y estado del proyecto
- Los cambios deben reflejarse inmediatamente en todas las interfaces
- Se debe mantener un historial de cambios realizados
- Solo usuarios con permisos de administrador pueden modificar proyectos

### Historia de Usuario 10 - Visualización de Backlog
**Como** miembro del equipo
**Quiero** visualizar el backlog con el estado de cada tarea
**Para** entender el progreso del proyecto y planificar mi trabajo

**Criterios de Aceptación:**
- El backlog debe mostrar todas las tareas del proyecto organizadas por sprint
- Cada tarea debe mostrar su estado actual (To Do, Doing, Done)
- Las tareas deben estar ordenadas por prioridad
- Se debe poder filtrar tareas por estado, asignado o sprint

### Gestión de Tareas

### Historia de Usuario 11 - Creación de Tareas
**Como** usuario (desarrollador o administrador)
**Quiero** crear tareas desde la web o el bot
**Para** registrar el trabajo que debe realizarse

**Criterios de Aceptación:**
- La tarea debe tener nombre, descripción y prioridad obligatorios
- Se debe poder asignar la tarea a un usuario específico
- La tarea debe crearse en estado "To Do" por defecto
- El sistema debe generar automáticamente un ID único para la tarea

### Historia de Usuario 12 - Edición de Tareas
**Como** usuario con permisos
**Quiero** editar tareas en el portal y en el chatbot
**Para** mantener actualizada la información de las tareas

**Criterios de Aceptación:**
- Se debe poder modificar nombre, descripción, estado y asignación
- Los cambios deben sincronizarse entre la web y el bot
- Solo el asignado o administradores pueden editar la tarea
- Se debe mantener un historial de cambios realizados

### Historia de Usuario 13 - Tareas Personales
**Como** desarrollador
**Quiero** ver una lista de mis tareas personales
**Para** enfocarme en mi trabajo asignado

**Criterios de Aceptación:**
- La lista debe mostrar solo tareas asignadas al usuario actual
- Las tareas deben estar ordenadas por prioridad y fecha de vencimiento
- Se debe poder filtrar por estado (To Do, Doing, Done)
- La lista debe estar disponible tanto en web como en el bot

### Historia de Usuario 14 - Tareas del Equipo
**Como** administrador
**Quiero** ver todas las tareas del equipo
**Para** supervisar el progreso general del proyecto

**Criterios de Aceptación:**
- La vista debe mostrar todas las tareas del proyecto
- Se debe poder filtrar por usuario asignado, estado y prioridad
- Debe incluir métricas de progreso del equipo
- Solo usuarios con rol de administrador pueden acceder a esta vista

### Historia de Usuario 15 - Cambio de Estado de Tareas
**Como** desarrollador
**Quiero** cambiar el estado de las tareas desde el bot o la web
**Para** reflejar el progreso de mi trabajo

**Criterios de Aceptación:**
- Los estados disponibles deben ser: To Do, Doing, Done
- El cambio debe sincronizarse inmediatamente entre web y bot
- Solo el asignado o administradores pueden cambiar el estado
- Se debe registrar la fecha y hora del cambio de estado

### Historia de Usuario 16 - Asignación de Tareas
**Como** administrador
**Quiero** asignar tareas a roles específicos
**Para** distribuir el trabajo entre los miembros del equipo

**Criterios de Aceptación:**
- Se debe poder asignar tareas a usuarios específicos
- El usuario asignado debe recibir una notificación
- Se debe poder reasignar tareas a otros usuarios
- Las tareas sin asignar deben aparecer en una lista especial

### Historia de Usuario 17 - Marcar Tareas como Completadas
**Como** desarrollador
**Quiero** marcar tareas como completadas desde el bot
**Para** actualizar rápidamente el progreso sin usar la web

**Criterios de Aceptación:**
- El bot debe permitir marcar tareas como "Done" con un comando simple
- Se debe confirmar la acción antes de ejecutarla
- La tarea debe cambiar automáticamente a estado "Done"
- Se debe registrar la fecha y hora de completado

### Historia de Usuario 18 - Horas Estimadas de Completado
**Como** desarrollador o administrador
**Quiero** agregar horas estimadas para completar una tarea
**Para** mejorar la planificación y seguimiento del proyecto

**Criterios de Aceptación:**
- Se debe poder ingresar horas estimadas al crear o editar una tarea
- Las horas deben ser números positivos
- Se debe poder comparar horas estimadas vs. tiempo real
- Esta información debe usarse para métricas de rendimiento

### Visualización y Reportes

### Historia de Usuario 19 - Gráficos de Rendimiento
**Como** administrador
**Quiero** ver gráficos de rendimiento del backlog y sprints
**Para** analizar la productividad del equipo

**Criterios de Aceptación:**
- Los gráficos deben mostrar progreso de tareas por sprint
- Se debe incluir burndown charts y velocity charts
- Los datos deben actualizarse en tiempo real
- Se debe poder exportar los gráficos como imágenes

### Historia de Usuario 20 - Tablero Kanban
**Como** usuario
**Quiero** un tablero de tareas con funcionalidad drag and drop
**Para** gestionar visualmente el flujo de trabajo

**Criterios de Aceptación:**
- El tablero debe tener columnas para To Do, Doing, Done
- Las tareas deben poder arrastrarse entre columnas
- El cambio de columna debe actualizar automáticamente el estado
- Se debe poder filtrar tareas por usuario o prioridad

### Historia de Usuario 21 - Dashboard de Desarrollador
**Como** desarrollador
**Quiero** un dashboard con mis métricas personales
**Para** monitorear mi rendimiento y productividad

**Criterios de Aceptación:**
- Debe mostrar tareas asignadas, completadas y en progreso
- Incluir métricas de tiempo promedio por tarea
- Mostrar progreso hacia objetivos del sprint
- Permitir acceso rápido a tareas prioritarias

### Historia de Usuario 22 - Dashboard de Administrador
**Como** administrador
**Quiero** un dashboard con el progreso de todos los proyectos
**Para** supervisar el estado general y tomar decisiones informadas

**Criterios de Aceptación:**
- Debe mostrar resumen de todos los proyectos activos
- Incluir métricas de rendimiento por equipo y desarrollador
- Mostrar alertas de tareas atrasadas o sprints en riesgo
- Permitir navegación rápida a proyectos específicos

### Historia de Usuario 23 - Vista de Atajos
**Como** usuario frecuente
**Quiero** una vista con atajos a funciones clave
**Para** acceder rápidamente a las acciones más comunes

**Criterios de Aceptación:**
- Debe incluir atajos a crear tarea, ver mis tareas, cambiar proyecto
- Los atajos deben ser personalizables por usuario
- Debe estar accesible desde cualquier página de la aplicación
- Incluir atajos tanto para web como para comandos del bot

## Restricciones

### Restricciones Técnicas
- **Infraestructura**: El sistema debe implementarse obligatoriamente en Oracle Cloud Infrastructure (OCI)
- **Base de Datos**: Uso exclusivo de Oracle Autonomous Database para la gestión de datos
- **Tecnología Backend**: Desarrollo obligatorio en Java con Spring Boot
- **Contenedores**: Implementación mediante Docker y orquestación con Kubernetes
- **API**: Uso de REST API de Oracle para comunicación entre componentes

### Restricciones de Rendimiento
- **Tiempo de Respuesta**: Todas las acciones críticas deben responder en menos de 2 segundos
- **Disponibilidad**: El bot de Telegram debe estar disponible 24/7
- **Escalabilidad**: El sistema debe soportar múltiples usuarios y proyectos sin degradación

### Restricciones de Seguridad
- **Autenticación**: Implementación obligatoria de autenticación basada en roles (admin, dev)
- **Cifrado**: Todas las contraseñas y datos sensibles deben estar cifrados
- **Protección**: Implementación de protección contra inyección SQL en todos los formularios

### Restricciones de Desarrollo
- **Arquitectura**: Uso obligatorio de microservicios para las funcionalidades
- **API Gateway**: Implementación de API Gateway para gestión de tráfico
- **CI/CD**: Integración y despliegue continuo obligatorio
- **Documentación**: Código modular y documentado para facilitar mantenimiento
