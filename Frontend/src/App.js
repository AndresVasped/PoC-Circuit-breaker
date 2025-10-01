

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ClientsList from './components/ClientsList';
import ClientForm from './components/ClientForm';
import ClientDetails from './components/ClientDetails';  

function App() {
  const [clients, setClients] = useState([]);

  const addClient = (newClient) => {
    setClients([...clients, newClient]);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<ClientsList clients={clients} />} />
          <Route path="/add-client" element={<ClientForm onSubmit={addClient} />} />
          <Route path="/client/:id" element={<ClientDetails />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;

