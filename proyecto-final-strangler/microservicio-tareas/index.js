// microservicio-tareas/index.js

// Importación de dependencias principales
const express = require('express');
const cors = require('cors');
const { getAllTasks, createTask, updateTask, deleteTask } = require('./controladores/tasks');

const app = express();
const port = 8002;

// Middleware para permitir solicitudes CORS y parsear JSON
app.use(cors());
app.use(express.json());

/**
 * --- SECCIÓN: SIMULACIÓN DE ATAQUE TEMPORAL ---
 * Permite activar un "fallo" temporal en el microservicio para pruebas de resiliencia.
 * Cuando el ataque está activo, ciertas rutas devolverán error 500.
 */
const FAILURE_DURATION_MS = 20000; // Duración del fallo simulado en milisegundos (20 segundos)
let isUnderAttack = false; // Estado del microservicio: ¿está bajo ataque?

/**
 * Ruta para activar el modo de ataque temporal.
 * Al activarse, el microservicio simula un fallo durante FAILURE_DURATION_MS.
 * Se revierte automáticamente después del tiempo definido.
 */
app.get('/attack/on', (req, res) => {
  if (isUnderAttack) {
    // Si ya está activo, devuelve error 400
    return res.status(400).send('La simulación de fallo ya está activa.');
  }

  isUnderAttack = true;
  console.log(`🚨 ATAQUE SIMULADO ACTIVADO. Se resolverá automáticamente en ${FAILURE_DURATION_MS / 1000} segundos.`);
  res.status(200).send(`Simulación de ataque activada por ${FAILURE_DURATION_MS / 1000} segundos.`);

  // Temporizador para desactivar el ataque automáticamente
  setTimeout(() => {
    isUnderAttack = false;
    console.log("✅ 'BUG' RESUELTO AUTOMÁTICAMENTE: El servicio vuelve a la normalidad.");
  }, FAILURE_DURATION_MS);
});
// --- FIN DE LA SECCIÓN DE ATAQUE ---


/**
 * --- RUTAS DEL MICROSERVICIO DE TAREAS ---
 */

/**
 * GET /tasks
 * Devuelve todas las tareas (sin filtrar por cliente).
 */
app.get('/tasks', (req, res) => {
  const tasks = getAllTasks();
  res.json(tasks);
});

/**
 * GET /clients/:id/tasks
 * Devuelve las tareas de un cliente específico.
 * Si el microservicio está bajo ataque, responde con error 500.
 */
app.get('/clients/:id/tasks', (req, res) => {
  if (isUnderAttack) {
    console.log("🚨 SIMULANDO FALLO CRÍTICO: Devolviendo error 500.");
    return res.status(500).send({ message: 'Error interno del servidor simulado' });
  }

  console.log("✨✨✨ ¡MICROSERVICIO EN ACCIÓN PARA PEDIR TAREAS! ✨✨✨");
  const { id } = req.params;
  const tasks = getAllTasks(id);
  res.json(tasks);
});

/**
 * POST /clients/:id/tasks
 * Crea una nueva tarea para un cliente específico.
 */
app.post('/clients/:id/tasks', (req, res) => {
  const { task } = req.body;
  const newTask = createTask(task);
  res.status(201).json(newTask);
});

/**
 * PUT /tasks/:id
 * Actualiza una tarea existente por su ID.
 */
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  const updatedTask = updateTask(id, task);
  res.status(200).json(updatedTask);
});

/**
 * DELETE /tasks/:id
 * Elimina una tarea por su ID.
 */
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  deleteTask(id);
  res.status(204).end();
});

/**
 * Inicialización del servidor
 */
app.listen(port, () => {
    console.log(`✨ Microservicio de Tareas (con modo de ataque temporal) corriendo en http://localhost:${port}`);
});