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

function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await getDashboardData();
      setData(res);
    }
    loadData();
  }, []);

  const exportToPDF = () => {
    const input = document.getElementById("dashboard-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("reporte-dashboard.pdf");
    });
  };

  if (!data)
    return <p className="text-center mt-10">Cargando estadísticas...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Estadísticas</h1>

      {/* Aquí va el bloque a capturar en PDF */}
      <div id="dashboard-content">
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h2 className="text-xl font-semibold">Total de Eventos</h2>
            <p className="text-3xl text-blue-600">{data.totalEventos}</p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h2 className="text-xl font-semibold">Total de Usuarios</h2>
            <p className="text-3xl text-green-600">{data.totalUsuarios}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">Eventos por Mes</h2>
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

      {/* Botón para exportar */}
      <button
        onClick={exportToPDF}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Exportar PDF
      </button>
    </div>
  );
}

export default DashboardPage;