// backend-monolito/index.js
const express = require('express');
const cors = require('cors');
const { getAllClients, createClient, deleteClient, getClientById } = require('./controladores/clients');
// Se eliminó la importación de tasks

const app = express();
const port = 8001; // ¡Nuevo puerto!

app.use(cors());
app.use(express.json());

// --- Rutas solo para clientes ---

app.get('/clients', (req, res) => {
  console.log("🏛️🏛️🏛️ ¡MONOLITO RECIBIÓ PETICIÓN PARA VER CLIENTES! 🏛️🏛️🏛️");
  res.json(getAllClients());
});

app.get('/clients/:id', (req, res) => {
  const client = getClientById(req.params.id);
  res.json(client);
});

app.post('/clients', (req, res) => {
  const newClient = createClient(req.body.client);
  res.status(201).json(newClient);
});

app.delete('/clients/:id', (req, res) => {
    deleteClient(req.params.id);
    res.status(204).end();
});

// --- SE ELIMINARON TODAS LAS RUTAS DE TAREAS ---

app.listen(port, () => {
  console.log(`🏛️  Monolito de Clientes corriendo en http://localhost:${port}`);
});