// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para navegar sin recargar la página
import './Home.css';  // Importa el archivo CSS

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido al Mini CRM</h1>
      <p className="home-subtitle">Gestiona tus clientes y tareas fácilmente.</p>
      <div className="home-buttons">
        <Link to="/clients">
          <button className="home-button">Ver Listado de Clientes</button>
        </Link>
        <Link to="/add-client">
          <button className="home-button">Agregar Nuevo Cliente</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
