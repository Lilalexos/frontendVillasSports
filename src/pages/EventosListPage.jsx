import { useEffect, useState, useCallback } from "react";
import { obtenerEventos, eliminarEvento } from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./EventosListPage.css";

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

  const cambiarFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const buscar = () => {
    setFiltrosAplicados(filtros);
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este evento?")) {
      await eliminarEvento(id);
      cargarEventos();
    }
  };

  const editar = (id) => {
    navigate(`/eventos/editar/${id}`);
  };

  const ver = (id) => {
    navigate(`/eventos/${id}`);
  };

  const crearEvento = () => {
    navigate("/eventos/nuevo");
  };

  const verMisEventos = () => {
    navigate("/mis-eventos");
  };

  const irADashboard = () => {
    navigate("/dashboard");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="pantalla">
      <div className="barra-superior">
        <div className="barra-izquierda">Villa’s Sports</div>
        <div className="barra-centro">Lista de eventos</div>
        <div className="barra-derecha">
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>

      <div className="contenedor-eventos">
        <div className="filtros">
          <input
            type="text"
            name="tipoEvento"
            placeholder="Filtrar por tipo de evento"
            value={filtros.tipoEvento}
            onChange={cambiarFiltro}
          />
          <input
            type="text"
            name="username"
            placeholder="Filtrar por nombre de usuario"
            value={filtros.username}
            onChange={cambiarFiltro}
          />
          <button onClick={buscar}>Buscar</button>
        </div>

        <div className="acciones">
          <button onClick={crearEvento}>Crear nuevo evento</button>
          <button onClick={verMisEventos}>Ver mis eventos</button>
          <button onClick={irADashboard}>Ir al Dashboard</button>
        </div>

        {cargando && <p>Cargando eventos...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="lista-eventos">
          {!cargando && eventos.length === 0 && !error && (
            <p>No hay eventos para mostrar.</p>
          )}

          {eventos.map((evento) => (
            <li key={evento._id}>
              <h3>{evento.nombreEvento}</h3>
              <p>Tipo: {evento.tipoEvento}</p>
              <p>Ubicación: {evento.ubicacion}</p>
              <p>Fecha: {new Date(evento.fechaHora).toLocaleString()}</p>
              <p>Creador: {evento.user?.username || "Desconocido"}</p>

              {user && evento.user?._id === user._id && (
                <>
                  <button onClick={() => editar(evento._id)}>Editar</button>
                  <button onClick={() => eliminar(evento._id)}>Eliminar</button>
                </>
              )}

              <button onClick={() => ver(evento._id)}>Ver detalles</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventosListPage;
