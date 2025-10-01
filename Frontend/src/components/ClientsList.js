// src/components/ClientsList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ClientsList.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // CAMBIO: Apuntamos al proxy en el puerto 3000
        const response = await fetch('http://localhost:3000/clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    fetchClients();
  }, []);

  const handleDeleteClient = async (id) => {
    try {
      // CAMBIO: Apuntamos al proxy en el puerto 3000
      const response = await fetch(`http://localhost:3000/clients/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setClients(clients.filter(client => client.id !== id));
      } else {
        console.error("Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error);
    }
  };

  // ... (el resto del return es igual)
  return (
    <div>
      <h2>Listado de Clientes</h2>
      <div className="client-cards-container">
        {clients.length === 0 ? (
          <div>No hay clientes disponibles</div>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="card-header">
                <h3>{client.name}</h3>
              </div>
              <div className="card-body">
                <p><strong>Correo:</strong> {client.email}</p>
                <p><strong>Teléfono:</strong> {client.phone}</p>
              </div>
              <div className="card-footer">
                <Link to={`/client/${client.id}`}>
                  <button className="btn-details">Ver Detalles</button>
                </Link>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDeleteClient(client.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsList;