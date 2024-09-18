import React from 'react';
import PublicarPedido from './components/PublicarPedido';
import Notificaciones from './components/Notificaciones';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Router>
      <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<PublicarPedido />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
