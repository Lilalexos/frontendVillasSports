import { useEffect, useState, useCallback } from "react";
import {
  obtenerEventosPorUsuario,
  eliminarEvento,
} from "../services/eventosService";
import { useNavigate } from "react-router-dom";
import "./UserEventosPage.css";

function UserEventosPage() {
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarEventos = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const response = await obtenerEventosPorUsuario();
      setEventos(response.data);
    } catch (error) {
      setError("Error al cargar tus eventos");
      console.error(error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este evento?")) {
      await eliminarEvento(id);
      cargarEventos();
    }
  };

  const handleEditar = (id) => {
    navigate(`/eventos/editar/${id}`);
  };

  const handleVolver = () => {
    navigate("/eventos");
  };

  return (
    <div className="pantalla">
      <div className="barra-superior">
        <div className="barra-izquierda">Mis Eventos</div>
        <div className="barra-centro">Villa’s Sport</div>
        <div className="barra-derecha">
          <button onClick={handleVolver}>Volver</button>
        </div>
      </div>

      <div className="contenedor-eventos">
        {cargando && <p className="cargando">Cargando eventos...</p>}
        {error && <p className="error">{error}</p>}
        {!cargando && eventos.length === 0 && !error && (
          <p className="error">No tienes eventos para mostrar.</p>
        )}

        <ul className="lista-eventos">
          {eventos.map((evento) => (
            <li
              key={evento._id}
              className={
                evento.tipoEvento === "futbol"
                  ? "evento-futbol"
                  : evento.tipoEvento === "basquet"
                  ? "evento-basquet"
                  : "evento-otro"
              }
            >
              <span className="badge">{evento.tipoEvento}</span>
              <h3>{evento.nombreEvento}</h3>
              <p>Ubicación: {evento.ubicacion}</p>
              <p>Fecha: {new Date(evento.fechaHora).toLocaleString()}</p>
              <div>
                <button onClick={() => handleEditar(evento._id)}>Editar</button>
                <button onClick={() => handleEliminar(evento._id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserEventosPage;
