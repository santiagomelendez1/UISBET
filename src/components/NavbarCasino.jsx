import { Container, Nav, Navbar, Button } from 'react-bootstrap';

// Importa Link de react-router-dom para navegar entre rutas sin recargar toda la página.
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Este componente representa la barra de navegación principal del sitio UISBET.COM.

function NavbarCasino() {
  // Obtiene el estado global del login.
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  // Hook para navegar a otra ruta después del logout.
  const navigate = useNavigate();

  // Cierra sesión y redirige al login.
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    /**
     * Parámetros usados:
     * - expand="xl": indica que la barra se mostrará expandida en pantallas grandes 
     * y se colapsará en pantallas pequeñas.
     * - fixed="top": fija la barra en la parte superior de la ventana.
     * - variant="dark": aplica estilo oscuro a la barra de navegación.
     */
    <Navbar expand="xl" fixed="top" className="uisbet-navbar" variant="dark">

      {/* Container centra el contenido y limita su ancho para que la barra
        no se extienda completamente de borde a borde.*/}
      <Container>

        {/* Marca principal. */}
        <Navbar.Brand as={Link} to="/" className="brand-text">
          UISBET.COM
        </Navbar.Brand>

        {/* Botón del menú móvil. */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Contenido colapsable del navbar. 
          -me-auto: empuja el contenido siguiente hacia la derecha.
          -ms-lg-4: agrega margen a la izquierda en pantallas grandes.
        */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto ms-xl-4">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            {/* Solo visibles con sesión. */}
            {isLoggedIn && <Nav.Link as={Link} to="/juegos">Juegos</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/fichas">Compras de fichas</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/saldo">Saldo</Nav.Link>}

            {/* Siempre visibles. */}
            <Nav.Link as={Link} to="/empresa">Información</Nav.Link>
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>

            {/* Solo admin. */}
            {isLoggedIn && user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/usuarios">Usuarios</Nav.Link>
            )}
            {isLoggedIn && user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/paquetes">Paquetes</Nav.Link>
            )}
            {isLoggedIn && user?.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/compras">Compras</Nav.Link>
            )}
          </Nav>

          {/* Si no hay sesión, muestra login y registro. */}
          {!isLoggedIn && (
            <div className="d-flex gap-2">
              <Button as={Link} to="/login" variant="outline-warning">
                Login
              </Button>

              <Button as={Link} to="/registro" variant="warning">
                Registro
              </Button>
            </div>
          )}

          {/* Si hay sesión, muestra nombre y logout. */}
          {isLoggedIn && (
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <Button variant="outline-warning" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCasino;