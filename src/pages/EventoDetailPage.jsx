import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  obtenerEventoPorId,
  eliminarEvento,
} from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";
import "./EventosDetailPage.css";

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

  if (error) return <p className="mensaje-error">{error}</p>;
  if (!evento) return <p className="mensaje-cargando">Cargando detalles...</p>;

  return (
    <div className="pantalla">
      <div className="barra-superior">
        <div className="barra-izquierda">Detalles del Evento</div>
        <div className="barra-centro">Villa’s Sport</div>
        <div className="barra-derecha">
          <button onClick={() => navigate("/eventos")}>Volver</button>
        </div>
      </div>

      <div className="detalle-contenedor">
        <h1>{evento.nombreEvento}</h1>
        <p><strong>Tipo:</strong> {evento.tipoEvento}</p>
        <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
        <p><strong>Fecha y hora:</strong> {new Date(evento.fechaHora).toLocaleString()}</p>
        <p><strong>Creado por:</strong> {evento.user?.username || "Desconocido"}</p>

        {user && evento.user?._id === user._id && (
          <div className="botones-acciones">
            <button onClick={handleEditar}>Editar</button>
            <button onClick={handleEliminar} className="btn-eliminar">Eliminar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventoDetailPage;
