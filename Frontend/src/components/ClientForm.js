// src/components/ClientForm.js
import React, { useState, useEffect } from 'react';

const ClientForm = ({ onSubmit }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // CAMBIO: Apuntamos al proxy en el puerto 3000
        const response = await fetch('http://localhost:3000/clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
    fetchClients();
  }, []);

  const clearInput = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (clientName !== '' && clientEmail !== '' && clientPhone !== '') {
      const newId = clients.length > 0 ? clients[clients.length - 1].id + 1 : 0;
      const newClient = {
        id: newId,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
      };

      try {
        // CAMBIO: Apuntamos al proxy en el puerto 3000
        const response = await fetch('http://localhost:3000/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client: newClient }),
        });
        const data = await response.json();
        if (response.ok) {
          onSubmit(data);
          clearInput();
        } else {
          setErrorMessage('Hubo un error al agregar el cliente.');
        }
      } catch (error) {
        setErrorMessage('Error de conexión al servidor');
      }
    } else {
      setErrorMessage('Todos los campos son obligatorios');
    }
  };

  // ... (el resto del return es igual)
  return (
    <div>
      <h3>Agregar Cliente</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nombre del cliente"
        />
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        <input
          type="text"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder="Teléfono"
        />
        <button type="submit">Agregar Cliente</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ClientForm;