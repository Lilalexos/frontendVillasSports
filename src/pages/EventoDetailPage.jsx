import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerEventoPorId, eliminarEvento } from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";

function EventoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [evento, setEvento] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const response = await obtenerEventoPorId(id);
        setEvento(response.data);
      } catch (error) {
        setError("Error al cargar detalles del evento");
        console.error(error);
      }
    };
    cargarEvento();
  }, [id]);

  const handleEliminar = async () => {
    if (window.confirm("¿Seguro que quieres eliminar este evento?")) {
      try {
        await eliminarEvento(id);
        navigate("/eventos");
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleEditar = () => {
    navigate(`/eventos/editar/${id}`);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!evento) return <p>Cargando detalles...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{evento.nombreEvento}</h1>
      <p><strong>Tipo:</strong> {evento.tipoEvento}</p>
      <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
      <p><strong>Fecha y hora:</strong> {new Date(evento.fechaHora).toLocaleString()}</p>
      <p><strong>Creado por:</strong> {evento.user?.username || "Desconocido"}</p>

      {/* Mostrar los botones solo si el evento es del usuario logueado */}
      {user && evento.user?._id === user._id && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleEditar} style={{ marginRight: "1rem" }}>Editar</button>
          <button onClick={handleEliminar}>Eliminar</button>
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/eventos")}>Volver a lista</button>
      </div>
    </div>
  );
}

export default EventoDetailPage;