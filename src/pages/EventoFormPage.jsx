import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { crearEvento, obtenerEventoPorId, actualizarEvento } from "../services/eventosService";
import { useAuth } from "../hooks/useAuth";

function EventoFormPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evento, setEvento] = useState({
    nombreEvento: "",
    tipoEvento: "",
    ubicacion: "",
    fechaHora: "",
  });

  useEffect(() => {
    if (id) {
      obtenerEventoPorId(id).then((res) => {
        setEvento({
          nombreEvento: res.data.nombreEvento,
          tipoEvento: res.data.tipoEvento,
          ubicacion: res.data.ubicacion,
          fechaHora: res.data.fechaHora?.slice(0, 16), // formato para input tipo datetime-local
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
    <div>
      <h2>{id ? "Editar Evento" : "Crear Evento"}</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">{id ? "Guardar cambios" : "Crear evento"}</button>
        <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
      </form>
    </div>
  );
}

export default EventoFormPage;
