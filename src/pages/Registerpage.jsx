import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registerpage.css"; // Asegúrate de tener este archivo
import videoFondo from "../assets/fondo.mp4";

export default function Registerpage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/register`, formData, {
        withCredentials: true,
      });
      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Registro exitoso!");
        navigate("/eventos");
      } else {
        alert("Registro exitoso! Por favor inicia sesión.");
        navigate("/login");
      }
    } catch (error) {
      alert(
        "Error en el registro: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="register-page">
      <video
        src={videoFondo}
        autoPlay
        loop
        muted
        className="video-background"
      />
      <div className="content">
        <h1 className="titulo">Regístrate a Villa’s Sport</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            name="username"
            placeholder="Usuario"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
