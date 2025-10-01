// proxy-strangler/index.js

// Importación de dependencias principales
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const Opossum = require('opossum'); // Circuit Breaker
const axios = require('axios'); // Cliente HTTP para llamadas a microservicio

const app = express();
const PORT = 3000;

// URLs de los servicios backend
const MONOLITO_URL = 'http://localhost:8001';
const MICROSERVICIO_TAREAS_URL = 'http://localhost:8002';

// --- CONFIGURACIÓN DEL CIRCUIT BREAKER ---
// Opciones para controlar el comportamiento del breaker
const circuitBreakerOptions = {
  timeout: 3000, // Tiempo máximo de espera por respuesta (ms)
  errorThresholdPercentage: 20, // Porcentaje de errores para abrir el circuito
  resetTimeout: 10000 // Tiempo para intentar reabrir el circuito (ms)
};

// Función protegida por el breaker: realiza la llamada HTTP al microservicio de tareas
const breaker = new Opossum(async (req) => {
  const url = MICROSERVICIO_TAREAS_URL + req.originalUrl;
  console.log(`✨ Breaker intentando llamar a: ${url}`);
  
  // Realiza la petición HTTP usando axios
  return axios({
    method: req.method,
    url: url,
    data: req.body,
    timeout: circuitBreakerOptions.timeout 
  });
}, circuitBreakerOptions);

// Eventos para monitorear el estado del breaker
breaker.on('open', () => console.log(`🚨 CIRCUITO ABIERTO: El servicio de tareas ha fallado.`));
breaker.on('halfOpen', () => console.log(`🟡 CIRCUITO SEMI-ABIERTO: Intentando conectar de nuevo...`));
breaker.on('close', () => console.log(`✅ CIRCUITO CERRADO: El servicio de tareas está operativo.`));
breaker.on('failure', (error) => console.error(`Fallo detectado por el breaker. Código: ${error.code || 'N/A'}`));

/**
 * Middleware que utiliza el Circuit Breaker para proteger las rutas de tareas.
 * Si el microservicio responde correctamente, reenvía la respuesta.
 * Si el breaker está abierto o la llamada falla, responde con error 503.
 */
const circuitBreakerMiddleware = (req, res) => {
  breaker.fire(req)
    .then(serviceResponse => {
      res.status(serviceResponse.status).send(serviceResponse.data);
    })
    .catch(err => {
      res.status(503).send({ message: 'El servicio de tareas no está disponible en este momento.' });
    });
};

// --- RUTAS ---

/**
 * REGLA 1: Las rutas de tareas se redirigen al microservicio usando el Circuit Breaker.
 * Protege las rutas /tasks y /clients/:id/tasks.
 */
app.use(['/tasks', '/clients/:id/tasks'], circuitBreakerMiddleware);

/**
 * REGLA 2: Todas las demás rutas se redirigen al monolito usando http-proxy-middleware.
 * Esto permite una migración progresiva de funcionalidades.
 */
app.use('/', createProxyMiddleware({
    target: MONOLITO_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🌿 Proxy a Monolito: [${req.method}] a '${req.originalUrl}'`);
    }
}));

/**
 * Inicialización del servidor proxy
 */
app.listen(PORT, () => {
    console.log(`🌿 Proxy Strangler (VERSIÓN FINAL Y CORRECTA) corriendo en http://localhost:${PORT}`);
});