import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

function DashboardPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardData();
      setData(res);
    }
    loadData();
  }, []);

  const exportToPDF = () => {
    const input = document.getElementById("dashboard-content");

    input.classList.add("pdf-export");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const marginX = 10;
      const marginY = 10;

      pdf.addImage(
        imgData,
        "PNG",
        marginX,
        marginY,
        pdfWidth - 2 * marginX,
        pdfHeight
      );
      pdf.save("reporte-dashboard.pdf");

      input.classList.remove("pdf-export");
    });
  };

  const volverAEventos = () => {
    navigate("/eventos");
  };

  if (!data)
    return <p className="mensaje-cargando">Cargando estadísticas...</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Panel de Estadísticas</h1>
        <button className="volver-btn" onClick={volverAEventos}>
          Volver a eventos
        </button>
      </div>

      <div id="dashboard-content">
        <div className="dashboard-cards">
          <div className="dashboard-card blue-card">
            <h2 className="card-title">Total de Eventos</h2>
            <p className="card-value">{data.totalEventos}</p>
          </div>
          <div className="dashboard-card green-card">
            <h2 className="card-title">Total de Usuarios</h2>
            <p className="card-value">{data.totalUsuarios}</p>
          </div>
        </div>

        <div className="chart-container">
          <h2 className="card-title">Eventos por Mes</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.eventosPorMes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button onClick={exportToPDF} className="export-button">
        Exportar PDF
      </button>
    </div>
  );
}

export default DashboardPage;
