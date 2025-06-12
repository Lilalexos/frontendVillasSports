import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearEvento,
  obtenerEventoPorId,
  actualizarEvento,
} from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";
import "./EventoFormPage.css";

function EventoFormPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evento, setEvento] = useState({
    nombreEvento: "",
    tipoEvento: "",
    ubicacion: "",
    fechaHora: "",
    descripcion: "",
  });

  useEffect(() => {
    if (id) {
      obtenerEventoPorId(id).then((res) => {
        setEvento({
          nombreEvento: res.data.nombreEvento,
          tipoEvento: res.data.tipoEvento,
          ubicacion: res.data.ubicacion,
          fechaHora: res.data.fechaHora?.slice(0, 16),
          descripcion: res.data.descripcion || "",
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvento((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await actualizarEvento(id, evento);
      } else {
        await crearEvento({ ...evento, user: user._id });
      }
      navigate("/eventos");
    } catch (error) {
      console.error("Error al guardar el evento", error);
    }
  };

  return (
    <div className="pantalla">
      <div className="barra-superior">
        <div className="barra-izquierda">
          {id ? "Editar Evento" : "Crear Evento"}
        </div>
        <div className="barra-centro">Villa’s Sport</div>
        <div className="barra-derecha">
          <button onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="formulario-evento">
          <input
            type="text"
            name="nombreEvento"
            placeholder="Nombre del evento"
            value={evento.nombreEvento}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tipoEvento"
            placeholder="Tipo de evento"
            value={evento.tipoEvento}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={evento.ubicacion}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="fechaHora"
            value={evento.fechaHora}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción del evento"
            value={evento.descripcion}
            onChange={handleChange}
            rows={4}
            className="textarea-descripcion"
          />
          <div className="botones-formulario">
            <button type="submit">
              {id ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventoFormPage;
