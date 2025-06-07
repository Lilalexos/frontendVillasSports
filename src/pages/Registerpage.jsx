import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      const res = await axios.post(
        `${BASE_URL}/register`,
        formData,
        { withCredentials: true }
      );

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
      alert("Error en el registro: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Registro de Usuario</h2>
      <input
        name="username"
        placeholder="Usuario"
        value={formData.username}
        onChange={handleChange}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <input
        name="email"
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ display: "block", width: "100%", marginBottom: "10px" }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Registrar
      </button>
    </form>
  );
}
