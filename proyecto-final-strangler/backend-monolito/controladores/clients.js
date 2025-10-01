const data = require('../../data-dummy/data.json');

// Obtener todos los clientes
const getAllClients = () => {
  return data.clients;
};

// Obtener un cliente por ID
const getClientById = (id) => {
  return data.clients.find(client => client.id == id);
};

// Crear un nuevo cliente (con el ID proporcionado desde Postman)
const createClient = (client) => {
  data.clients.push(client); // Agregar el cliente al arreglo
  return client; // Retornar el cliente creado
};

// Eliminar un cliente por ID
const deleteClient = (id) => {
  const clientIndex = data.clients.findIndex(client => client.id == id);
  if (clientIndex === -1) {
    return { message: "Cliente no encontrado", error: true };
  } else {
    const deletedClient = data.clients.splice(clientIndex, 1); // Eliminar el cliente
    return { message: "Cliente eliminado", error: false, client: deletedClient };
  }
};

module.exports = { 
    
    getAllClients, 
    createClient, 
    getClientById, 
    deleteClient };
