import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registerpage.css";
import videoFondo from "../assets/fondo.mp4";

export default function Registerpage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

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
      if (error.response?.data?.message) {
        const msg = error.response.data.message.toLowerCase();
        if (msg.includes("email")) setError("Este correo ya está registrado.");
        else if (msg.includes("username"))
          setError("Este nombre de usuario ya existe.");
        else setError("Error: " + error.response.data.message);
      } else {
        setError("Error en el registro. Intenta nuevamente.");
      }
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
          {error && <p className="error-message">{error}</p>}

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
          <div className="password-row">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="toggle-password-outside"
              aria-label="Mostrar u ocultar contraseña"
            >
              <i
                className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              ></i>
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repite la contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
