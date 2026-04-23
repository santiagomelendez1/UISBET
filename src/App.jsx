import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Juegos from './pages/Juegos';
import Fichas from './pages/Fichas';
import Saldo from './pages/Saldo';
import Empresa from './pages/Empresa';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Ruleta from './pages/Ruleta';
import Baccarat from './pages/Baccarat';

import './styles/Home.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Home />}     />
        <Route path="/juegos"    element={<Juegos />}   />
        <Route path="/fichas"    element={<Fichas />}   />
        <Route path="/saldo"     element={<Saldo />}    />
        <Route path="/empresa"   element={<Empresa />}  />
        <Route path="/contacto"  element={<Contacto />} />
        <Route path="/login"     element={<Login />}    />
        <Route path="/registro"  element={<Registro />} />
        <Route path="/ruleta"    element={<Ruleta />}   />
        <Route path="/baccarat"  element={<Baccarat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
