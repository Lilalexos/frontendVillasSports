import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDashboardData() {
  try {
    const res = await axios.get(`${API_URL}/dashboard`);
    return res.data;
  } catch (error) {
    console.error("Error en getDashboardData:", error);
    return null;
  }
}
