import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Loginpage.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        setMensaje("Inicio de sesión exitoso");
        navigate("/eventos");
      } else {
        setMensaje("Error: Token no recibido");
      }
    } catch (error) {
      setMensaje("Credenciales incorrectas o error del servidor");
      console.error(error);
    }
  };

  useEffect(() => {
    return () => setMensaje("");
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Bienvenido a Villa’s Sports</h1>
      <p>
        Somos una plataforma dedicada a la organización de eventos deportivos y
        actividades recreativas. Aquí podrás registrarte, iniciar sesión y
        gestionar tus eventos de una manera super sencilla.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "400px", marginTop: "2rem" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          Iniciar sesión
        </button>
      </form>

      {mensaje && (
        <p
          style={{
            marginTop: "1rem",
            color:
              mensaje.toLowerCase().includes("error") ||
              mensaje.toLowerCase().includes("incorrectos")
                ? "red"
                : "green",
          }}
        >
          {mensaje}
        </p>
      )}

      {/* Crear cuenta */}
      <p style={{ marginTop: "1.5rem" }}>
        ¿No tienes cuenta?{" "}
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            fontSize: "1em",
          }}
        >
          Regístrate aquí
        </button>
      </p>
    </div>
  );
}

export default Loginpage;
