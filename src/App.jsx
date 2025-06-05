import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registerpage from './pages/Registerpage';
import Loginpage from './pages/Loginpage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Página de inicio</h1>} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
