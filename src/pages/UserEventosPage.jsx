import { useEffect, useState, useCallback } from "react";
import { obtenerEventosPorUsuario, eliminarEvento } from "../services/eventosService";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Mis Eventos</h2>
      {/* Botón de volver general */}
      <button onClick={handleVolver}>Volver a Lista de Eventos</button>

      {cargando && <p>Cargando eventos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {!cargando && eventos.length === 0 && !error && <p>No tienes eventos para mostrar.</p>}

        {eventos.map((evento) => (
          <li key={evento._id}>
            <h3>{evento.nombreEvento}</h3>
            <p>Tipo: {evento.tipoEvento}</p>
            <p>Ubicación: {evento.ubicacion}</p>
            <p>Fecha: {new Date(evento.fechaHora).toLocaleString()}</p>

            <button onClick={() => handleEditar(evento._id)}>Editar</button>
            <button onClick={() => handleEliminar(evento._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserEventosPage;
