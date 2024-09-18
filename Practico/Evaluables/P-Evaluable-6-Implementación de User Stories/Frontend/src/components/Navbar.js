import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="Publicar pedido">
          <Link to="/" className="nav-link">Publicar Pedido</Link>
        </li>
        <li className="Transportista">
          <Link to="/notificaciones" className="nav-link">Notificaciones</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;