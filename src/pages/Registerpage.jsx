import React, { useState } from 'react';

export default function Registerpage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  //Aqui se importa la ruta del .env para las peticiones
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Error en el registro');
      }

      const data = await res.json();
      alert('Registro exitoso!');
      console.log(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Registro de Usuario</h2>
      <input 
        name="username" 
        placeholder="Usuario" 
        value={formData.username} 
        onChange={handleChange} 
        required 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />
      <input 
        name="email" 
        type="email" 
        placeholder="Correo electrónico" 
        value={formData.email} 
        onChange={handleChange} 
        required 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Contraseña" 
        value={formData.password} 
        onChange={handleChange} 
        required 
        style={{ display: 'block', width: '100%', marginBottom: '10px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>Registrar</button>
    </form>
  );
}
