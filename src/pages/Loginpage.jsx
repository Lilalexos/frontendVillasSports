import { useState } from 'react';
import axios from 'axios';
import './Loginpage.css';

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password }
      );
      setMensaje('Inicio de sesión exitoso');
      console.log('Token recibido:', response.data.token);
    } catch (error) {
      setMensaje('Credenciales incorrectas o error del servidor');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenido a Villa’s Sport</h1>
      <p>
        En Villa’s Sport encontrarás los mejores artículos deportivos para potenciar tu rendimiento.
        Inicia sesión para descubrir nuestras promociones exclusivas.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>
          Iniciar sesión
        </button>
      </form>

      {mensaje && <p style={{ marginTop: '1rem', color: 'green' }}>{mensaje}</p>}
    </div>
  );
}

export default Loginpage;
