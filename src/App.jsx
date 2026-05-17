import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Juegos from './pages/Juegos';
import Fichas from './pages/Fichas';
import Saldo from './pages/Saldo';
import Empresa from './pages/Empresa';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Ruleta from './pages/Ruleta';
import Baccarat from './pages/Baccarat';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminPaquetes from './pages/AdminPaquetes';
import AdminCompras from './pages/AdminCompras';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas. */}
        <Route path="/" element={<Home />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas privadas. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/juegos" element={<Juegos />} />
          <Route path="/fichas" element={<Fichas />} />
          <Route path="/saldo" element={<Saldo />} />
          <Route path="/ruleta" element={<Ruleta />} />
          <Route path="/baccarat" element={<Baccarat />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/admin/paquetes" element={<AdminPaquetes />} />
          <Route path="/admin/compras" element={<AdminCompras />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;