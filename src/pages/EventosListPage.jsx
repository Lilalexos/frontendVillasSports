import { useEffect, useState, useCallback } from "react";
import { obtenerEventos, eliminarEvento } from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function EventosListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eventos, setEventos] = useState([]);
  const [filtros, setFiltros] = useState({ tipoEvento: "", username: "" });
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    tipoEvento: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargarEventos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const filtrosQuery = {};
      if (filtrosAplicados.tipoEvento)
        filtrosQuery.tipoEvento = filtrosAplicados.tipoEvento;
      if (filtrosAplicados.username)
        filtrosQuery.username = filtrosAplicados.username;

      const response = await obtenerEventos(filtrosQuery);
      setEventos(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        if (filtrosAplicados.username) {
          setError("Usuario no encontrado.");
        } else if (filtrosAplicados.tipoEvento) {
          setError("Tipo de evento no encontrado.");
        } else {
          setError("No se encontraron eventos.");
        }
        setEventos([]);
      } else {
        setError("Error cargando eventos.");
        console.error(error);
      }
    } finally {
      setCargando(false);
    }
  }, [filtrosAplicados]);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = () => {
    setFiltrosAplicados(filtros);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este evento?")) {
      await eliminarEvento(id);
      cargarEventos();
    }
  };

  const handleEditar = (id) => {
    navigate(`/eventos/editar/${id}`);
  };

  const handleVer = (id) => {
    navigate(`/eventos/${id}`);
  };

  const handleCrearEvento = () => {
    navigate("/eventos/nuevo");
  };

  const handleVerMisEventos = () => {
    navigate("/mis-eventos");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={handleLogout}
        style={{
          float: "right",
          padding: "8px 16px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>

      <h2>Lista de Eventos</h2>

      <div>
        <input
          type="text"
          name="tipoEvento"
          placeholder="Filtrar por tipo de evento"
          value={filtros.tipoEvento}
          onChange={handleFiltroChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Filtrar por nombre de usuario"
          value={filtros.username}
          onChange={handleFiltroChange}
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleCrearEvento}>Crear nuevo evento</button>{" "}
        <button onClick={handleVerMisEventos}>Ver mis eventos</button>
      </div>

      {cargando && <p>Cargando eventos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {!cargando && eventos.length === 0 && !error && (
          <p>No hay eventos para mostrar.</p>
        )}

        {eventos.map((evento) => (
          <li key={evento._id} style={{ marginBottom: "1rem" }}>
            <h3>{evento.nombreEvento}</h3>
            <p>Tipo: {evento.tipoEvento}</p>
            <p>Ubicación: {evento.ubicacion}</p>
            <p>Fecha: {new Date(evento.fechaHora).toLocaleString()}</p>
            <p>Creador: {evento.user?.username || "Desconocido"}</p>

            {user && evento.user?._id === user._id && (
              <>
                <button onClick={() => handleEditar(evento._id)}>Editar</button>{" "}
                <button onClick={() => handleEliminar(evento._id)}>Eliminar</button>
              </>
            )}

            <button onClick={() => handleVer(evento._id)}>Ver detalles</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventosListPage;