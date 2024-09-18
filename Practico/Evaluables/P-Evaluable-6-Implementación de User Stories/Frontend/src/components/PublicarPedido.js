import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { saveMessage } from '../services/apiService';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/images/logo.png';

import './PublicarPedido.css';

const PublicarPedido = () => {
  const [formData, setFormData] = useState({
    tipoCarga: '',
    calleRetiro: '',
    numeroRetiro: '',
    localidadRetiro: '',
    provinciaRetiro: '',
    referenciaRetiro: '',
    fechaRetiro: '',
    calleEntrega: '',
    numeroEntrega: '',
    localidadEntrega: '',
    provinciaEntrega: '',
    referenciaEntrega: '',
    fechaEntrega: '',
    observaciones: '',
    fotos: [],
  });

  useEffect(() => {
    return () => {
      toast.dismiss();
    };
  }, []);


  //esto

  const [localidadesRetiro, setLocalidadesRetiro] = useState([]);
  const [localidadesEntrega, setLocalidadesEntrega] = useState([]);
  const [error, setError] = useState('');
  const [formValid, setFormValid] = useState(false);

  const maxObservaciones = 150;
  const maxReferencia = 150;


  const localidadesBuenosAires = [
    "La Plata", "Mar del Plata", "Bahía Blanca", "Quilmes", "Lanús",
    "Tandil", "San Nicolás", "Tigre", "Avellaneda", "San Fernando"
  ];

  const localidadesSantaFe = [
    "Rosario Centro", "Funes", "Pérez", "Granadero Baigorria", "Villa Gobernador Gálvez",
    "San Lorenzo", "Arroyo Seco", "Capitán Bermúdez", "Roldán", "Fray Luis Beltrán"
  ];

  const localidadesNeuquen = [
    "Neuquén Capital", "Plottier", "Centenario", "San Martín de los Andes", "Zapala",
    "Cutral Có", "Plaza Huincul", "Villa La Angostura", "Rincón de los Sauces", "Chos Malal"
  ];

  const localidadesCordoba = [
    "Córdoba Capital", "Villa Carlos Paz", "Río Cuarto", "Villa María", "San Francisco",
    "Alta Gracia", "Río Tercero", "Cosquín", "Jesús María", "La Falda"
  ];

  const fileInputRef = useRef(null);

  const validateForm = () => {
    const { tipoCarga, calleRetiro, numeroRetiro, localidadRetiro, provinciaRetiro, fechaRetiro, calleEntrega, numeroEntrega, localidadEntrega, provinciaEntrega, fechaEntrega } = formData;

    if (
      tipoCarga &&
      calleRetiro &&
      numeroRetiro &&
      localidadRetiro &&
      provinciaRetiro &&
      fechaRetiro &&
      calleEntrega &&
      numeroEntrega &&
      localidadEntrega &&
      provinciaEntrega &&
      fechaEntrega
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

  // Manejar el cambio de la provincia y actualizar localidades
  const handleProvinceChangeRetiro = (e) => {
    const { name, value } = e.target;
    let newLocalidades = [];

    switch (value) {
      case 'Buenos Aires':
        newLocalidades = localidadesBuenosAires;
        break;
      case 'Santa Fe':
        newLocalidades = localidadesSantaFe;
        break;
      case 'Neuquen':
        newLocalidades = localidadesNeuquen;
        break;
      case 'Cordoba':
        newLocalidades = localidadesCordoba;
        break;
      default:
        newLocalidades = [];
    }

    setLocalidadesRetiro(newLocalidades);
    setFormData({ ...formData, [name]: value, localidadRetiro: '' });
    validateForm();
  };


  // Manejar el cambio de la provincia y actualizar localidades para Entrega
  const handleProvinceChangeEntrega = (e) => {
    const { name, value } = e.target;
    let newLocalidades = [];

    switch (value) {
      case 'Buenos Aires':
        newLocalidades = localidadesBuenosAires;
        break;
      case 'Santa Fe':
        newLocalidades = localidadesSantaFe;
        break;
      case 'Neuquen':
        newLocalidades = localidadesNeuquen;
        break;
      case 'Cordoba':
        newLocalidades = localidadesCordoba;
        break;
      default:
        newLocalidades = [];
    }

    setLocalidadesEntrega(newLocalidades);
    setFormData({ ...formData, [name]: value, localidadEntrega: '' });
    validateForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar solo números positivos para los campos de "Número"
    if ((name === 'numeroRetiro' || name === 'numeroEntrega') && (!/^\d+$/.test(value) && value !== '')) {
      return;
    }

    // Limitar la longitud de observaciones y referencias
    if (name === "observaciones" && value.length > maxObservaciones) {
      return;
    }
    if ((name === "referenciaRetiro" || name === "referenciaEntrega") && value.length > maxReferencia) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
    validateForm();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 3;
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    setError('');

    if (files.length > maxFiles) {
      setError(`Solo puedes subir un máximo de ${maxFiles} fotos.`);
      return;
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0);
    if (totalSize > maxSizeInBytes) {
      setError(`El tamaño total de las fotos debe ser menor a ${maxSizeInMB} MB.`);
      return;
    }

    setFormData({
      ...formData,
      fotos: files,
    });

    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const messageData = {
      tipoCarga: formData.tipoCarga,
      domicilioRetiro: {
        calle: formData.calleRetiro,
        numero: formData.numeroRetiro,
        localidad: formData.localidadRetiro,
        provincia: formData.provinciaRetiro,
        referencia: formData.referenciaRetiro
      },
      fechaRetiro: formData.fechaRetiro,
      referenciaRetiro: formData.referenciaRetiro,
      domicilioEntrega: {
        calle: formData.calleEntrega,
        numero: formData.numeroEntrega,
        localidad: formData.localidadEntrega,
        provincia: formData.provinciaEntrega,
        referencia: formData.referenciaEntrega
      },
      fechaEntrega: formData.fechaEntrega,
      referenciaEntrega: formData.referenciaEntrega,
      observacion: formData.observaciones
    };
    try {
      await saveMessage(messageData);
      toast.success('Pedido publicado con éxito!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


      setFormData({
        tipoCarga: '',
        calleRetiro: '',
        numeroRetiro: '',
        localidadRetiro: '',
        provinciaRetiro: '',
        referenciaRetiro: '',
        fechaRetiro: '',
        calleEntrega: '',
        numeroEntrega: '',
        localidadEntrega: '',
        provinciaEntrega: '',
        referenciaEntrega: '',
        fechaEntrega: '',
        observaciones: '',
        fotos: [],
      });

      // Limpiar las localidades seleccionadas
      setLocalidadesRetiro([]);
      setLocalidadesEntrega([]);
      setError('');
      setFormValid(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al publicar el pedido:', error);
      setError('Error al publicar el pedido. Inténtalo nuevamente.');
    }
  };

  return (

    <div className="form-page">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Publicar Pedido</h1>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipo de carga: <span>*</span></label>
          <select name="tipoCarga" value={formData.tipoCarga} onChange={handleChange} required>
            <option value="">Selecciona un tipo de carga</option>
            <option value="documentacion">Documentación</option>
            <option value="paquete">Paquete</option>
            <option value="granos">Granos</option>
            <option value="hacienda">Hacienda</option>
          </select>
        </div>

        <div className="form-group">
          <label>Dirección de Retiro: <span>*</span></label>
          <input
            type="text"
            name="calleRetiro"
            value={formData.calleRetiro}
            onChange={handleChange}
            placeholder="Calle"
            required
          />
          <input
            type="text"
            name="numeroRetiro"
            value={formData.numeroRetiro}
            onChange={handleChange}
            placeholder="Número"
            required
          />



          <select name="provinciaRetiro" value={formData.provinciaRetiro} onChange={handleProvinceChangeRetiro} required>
            <option value="">Selecciona una provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Neuquen">Neuquén</option>
            <option value="Cordoba">Córdoba</option>
          </select>

          <select name="localidadRetiro" value={formData.localidadRetiro} onChange={handleChange} required>
            <option value="">Selecciona una localidad</option>
            {localidadesRetiro.map((localidad, index) => (
              <option key={index} value={localidad}>{localidad}</option>
            ))}
          </select>

          <textarea
            name="referenciaRetiro"
            value={formData.referenciaRetiro}
            onChange={handleChange}
            maxLength={maxReferencia}
            placeholder="Referencia (opcional, máximo 150 caracteres)"
          ></textarea>
          <p className="char-count">{maxReferencia - formData.referenciaRetiro.length} caracteres restantes</p>
        </div>

        <div className="form-group">
          <label>Fecha de Retiro: <span>*</span></label>
          <input
            type="date"
            name="fechaRetiro"
            value={formData.fechaRetiro}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label>Dirección de Entrega: <span>*</span></label>
          <input
            type="text"
            name="calleEntrega"
            value={formData.calleEntrega}
            onChange={handleChange}
            placeholder="Calle"
            required
          />
          <input
            type="text"
            name="numeroEntrega"
            value={formData.numeroEntrega}
            onChange={handleChange}
            placeholder="Número"
            required
          />
          <select name="provinciaEntrega" value={formData.provinciaEntrega} onChange={handleProvinceChangeEntrega} required>
            <option value="">Selecciona una provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Neuquen">Neuquén</option>
            <option value="Cordoba">Córdoba</option>
          </select>
          <select name="localidadEntrega" value={formData.localidadEntrega} onChange={handleChange} required>
            <option value="">Selecciona una localidad</option>
            {localidadesEntrega.map((localidad, index) => (
              <option key={index} value={localidad}>{localidad}</option>
            ))}
          </select>

          <textarea
            name="referenciaEntrega"
            value={formData.referenciaEntrega}
            onChange={handleChange}
            maxLength={maxReferencia}
            placeholder="Referencia (opcional, máximo 150 caracteres)"
          ></textarea>
          <p className="char-count">{maxReferencia - formData.referenciaEntrega.length} caracteres restantes</p>
        </div>

        <div className="form-group">
          <label>Fecha de Entrega: <span>*</span></label>
          <input
            type="date"
            name="fechaEntrega"
            value={formData.fechaEntrega}
            onChange={handleChange}
            required
            min={formData.fechaRetiro || new Date().toISOString().split("T")[0]}
          />
        </div>

        <div className="form-group">
          <label>Observaciones (opcional, máximo 150 caracteres):</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            maxLength={maxObservaciones}
            placeholder="Ingresa observaciones sobre el transporte"
          ></textarea>
          <p className="char-count">{maxObservaciones - formData.observaciones.length} caracteres restantes</p>
        </div>

        <div className="form-group">
          <label>Adjuntar fotos (opcional, máximo 3 fotos y 10MB en total):</label>
          <input
            type="file"
            name="fotos"
            accept=".jpg, .png"
            multiple
            onChange={handleFileChange}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Publicar Pedido</button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default PublicarPedido;
