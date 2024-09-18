import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Mapa from '../assets/images/mapa-centro.png'

import './Notificaciones.css';
import './ToastStyle.css';

const Notificaciones = () => {

  useEffect(() => {
    toast.info('Tienes un pedido de envio en tu zona de cobertura', {
      position: "top-right",    
      autoClose: 5000,          
      hideProgressBar: false,  
      closeOnClick: true,       
      pauseOnHover: true,       
      draggable: false,         
      progress: undefined,   
      theme: "light",
      className: 'custom-toast custom-toast-info'           
    });
  }, []);

  return (
    <div className="notificaciones-container">
      <div className="header">
        <h1>Transportista</h1>
      </div>
      <h2>Mapa</h2>
      <div className="map-container">
        <img src={Mapa}/>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Notificaciones;
