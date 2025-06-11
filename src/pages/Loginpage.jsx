import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Loginpage.css";
import videoFondo from "../assets/fondo.mp4";
import { FaArrowDown } from "react-icons/fa";

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

  const scrollToLogin = () => {
    const loginSection = document.getElementById("login-section");
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="login-page-container">
      <video className="video-background" autoPlay loop muted>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="welcome-content">
        <h1 className="titulo-verde">Bienvenido a Villa’s Sports</h1>
        <p className="descripcion">
          Somos una plataforma dedicada a la organización de eventos deportivos y
          actividades recreativas. Aquí podrás registrarte, iniciar sesión y
          gestionar tus eventos de una manera sencilla.
        </p>
        <FaArrowDown className="flecha-bajar" onClick={scrollToLogin} />
      </div>

      <div id="login-section" className="login-section">
        <h1 className="login-title">Villa’s Sports</h1>
        <div id="login-form">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label>Correo electrónico:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Iniciar sesión</button>
          </form>

          {mensaje && (
            <p
              style={{
                marginTop: "1rem",
                color:
                  mensaje.toLowerCase().includes("error") ||
                  mensaje.toLowerCase().includes("incorrectos")
                    ? "red"
                    : "lime",
              }}
            >
              {mensaje}
            </p>
          )}

          <p style={{ marginTop: "1.5rem" }}>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "none",
                border: "none",
                color: "aqua",
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
      </div>
    </div>
  );
}

export default Loginpage;
