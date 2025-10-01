# Proyecto Demo: Patrones Strangler Fig y Circuit Breaker

Este proyecto es una aplicación web full-stack diseñada para demostrar dos patrones de arquitectura de software cruciales para la modernización y resiliencia de sistemas: el **Patrón Strangler Fig** y el **Patrón Circuit Breaker**.

Sirve como un caso de estudio práctico para migrar una funcionalidad de una arquitectura monolítica a un microservicio, protegiendo al mismo tiempo el sistema contra fallos.



## 📖 Descripción General del Proyecto

Este proyecto es una aplicación de **CRM (Customer Relationship Management)** en miniatura. Su propósito es simular un entorno empresarial real donde se gestiona la información y las interacciones con los clientes.

Las funcionalidades principales de la aplicación son:
* **Listar Clientes:** Visualizar una lista de todos los clientes registrados en el sistema.
* **Gestionar Clientes:** Permite agregar nuevos clientes a la base de datos y eliminarlos.
* **Ver Detalles del Cliente:** Acceder a una vista individual para un cliente específico.
* **Gestionar Tareas:** Dentro de la vista de detalles de un cliente, el sistema permite crear, editar y eliminar tareas asociadas exclusivamente a ese cliente, facilitando el seguimiento de actividades.

---
## 🏛️ Conceptos de Arquitectura Demostrados

* **Patrón Strangler Fig:** Se extrae la funcionalidad de "Gestión de Tareas" desde un backend monolítico hacia un microservicio independiente sin interrumpir el servicio.
* **Arquitectura de Microservicios:** El resultado es un ecosistema donde un monolito reducido y un nuevo microservicio coexisten.
* **Strangler Facade (Proxy Inverso):** Un proxy de Node.js actúa como la única puerta de entrada (`Facade`), enrutando el tráfico de manera inteligente hacia el servicio correspondiente.
* **Patrón Circuit Breaker:** Se implementa un "cortocircuito" en el proxy para monitorear la salud del nuevo microservicio y proteger el sistema contra fallos en cascada.
* **Simulación de Fallos:** Se incluyen métodos para demostrar la resiliencia: un "bug" interno programado y un ataque de carga (DoS).

---
## 🏗️ Arquitectura del Proyecto

El front-end se comunica exclusivamente con un Proxy (Strangler Facade). Este proxy contiene la lógica del Circuit Breaker y decide a qué servicio de backend enviar cada petición, aislando las funcionalidades.

![Diagrama de la Arquitectura Strangler](./assets/diagrama.png)

*El escudo 🛡️ en el Proxy simboliza el Circuit Breaker protegiendo las llamadas hacia el Microservicio de Tareas.*

---
## 🛠️ Tech Stack

* **Front-End:** React
* **Back-End:** Node.js, Express
* **Patrones y Librerías Clave:**
    * `http-proxy-middleware` para la implementación del Proxy.
    * `opossum` y `axios` para la implementación del Circuit Breaker.
* **Herramientas de Simulación:**
    * `autocannon` para pruebas de carga y simulación de ataques DoS.

---
## 🚀 Cómo Usarlo

Sigue estos pasos para levantar todo el entorno en tu máquina local.

### Prerrequisitos

* Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior).

### Instalación

1.  Clona este repositorio.
2.  Abre **4 terminales separadas**, una para cada servicio.
3.  En cada una de las siguientes carpetas, ejecuta el comando `npm install`:
    * `cd frontend/` y luego `npm install`
    * `cd proxy-strangler/` y luego `npm install`
    * `cd backend-monolito/` y luego `npm install`
    * `cd microservicio-tareas/` y luego `npm install`

### Ejecución

Con las 4 terminales aún abiertas en sus respectivas carpetas, ejecuta el comando `npm start` en cada una.

* **Terminal 1 (Front-End):** `npm start` (se abrirá en `http://localhost:3001` o similar)
* **Terminal 2 (Proxy):** `npm start` (correrá en `http://localhost:3000`)
* **Terminal 3 (Monolito):** `npm start` (correrá en `http://localhost:8001`)
* **Terminal 4 (Microservicio):** `npm start` (correrá en `http://localhost:8002`)

---
## 🎬 Guion de Demostración de Fallos

Una vez que todo esté corriendo, puedes demostrar la resiliencia del sistema con dos métodos.

### Método 1: Simular un "Bug" Interno (Recomendado para la demo)

Este método activa un fallo controlado dentro del microservicio.

1.  **Verificar Estado Normal:** Navega por la aplicación y muestra que todo funciona.
2.  **Activar el "Bug":** Abre una nueva pestaña en el navegador y visita el "endpoint tóxico":
    `http://localhost:8002/attack/on`
    La terminal del microservicio confirmará que el modo fallo está activo.
3.  **Observar la Defensa:** Vuelve a la aplicación y recarga la página de "Detalles" 2 o 3 veces. Verás que la aplicación falla y la terminal del **proxy** mostrará el mensaje: `🚨 CIRCUITO ABIERTO`.
4.  **Observar la Recuperación:** Espera el tiempo configurado (20 segundos del bug + 10 segundos del breaker). La terminal del microservicio mostrará que el "bug" se ha resuelto. Al recargar la aplicación, verás en la terminal del proxy los mensajes de recuperación (`🟡 SEMI-ABIERTO`, `✅ CERRADO`) y la app volverá a funcionar.

### Método 2: Simular un Ataque de Carga (DoS)

Este método usa una herramienta externa para bombardear el sistema con peticiones.

1.  **Instalar Herramienta:** Si no lo has hecho, abre una **quinta terminal** e instala `autocannon` globalmente:
    ```bash
    npm install -g autocannon
    ```
2.  **Lanzar el Ataque:** En esa quinta terminal, ejecuta el siguiente comando para disparar 100 conexiones simultáneas durante 20 segundos contra el proxy:
    ```bash
    autocannon -c 100 -d 20 http://localhost:3000/clients/1/tasks
    ```
3.  **Observar la Defensa:** Mientras el ataque está en curso, asegúrate de que el "bug" del **Método 1** esté activado (`/attack/on`) para que las peticiones fallen. Mira la terminal del **proxy**: verás cómo se registran los fallos y, al superarse el umbral, aparecerá el mensaje `🚨 CIRCUITO ABIERTO`.

---
**Autor:** Tu Nombre