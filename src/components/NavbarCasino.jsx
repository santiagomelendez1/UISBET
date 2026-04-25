import { Container, Nav, Navbar, Button } from 'react-bootstrap';

// Importa Link de react-router-dom para navegar entre rutas sin recargar toda la página.
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

// Este componente representa la barra de navegación principal del sitio UISBET.COM.


function NavbarCasino() {

  // Obtiene el estado global del login.
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  // Hook para navegar a otra ruta después del logout.
  const navigate = useNavigate();

  // Cierra la sesión del usuario y lo redirige al login.
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    /**
     * Parámetros usados:
     * - expand="lg": indica que la barra se mostrará expandida en pantallas grandes 
     * y se colapsará en pantallas pequeñas.
     * - fixed="top": fija la barra en la parte superior de la ventana.
     * - variant="dark": aplica estilo oscuro a la barra de navegación.
     */
    <Navbar expand="lg" fixed="top" className="uisbet-navbar" variant="dark">
      
      {/* Container centra el contenido y limita su ancho para que la barra
        no se extienda completamente de borde a borde.*/}
      <Container>
        
        {/* Navbar.Brand: logo principal del sitio. */}
        <Navbar.Brand as={Link} to="/" className="brand-text">
          UISBET.COM
        </Navbar.Brand>

        {/* Navbar.Toggle: Abre lista de menú en pantallas pequeñas. */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Navbar.Collapse: contiene las secciones del menú. */}
        <Navbar.Collapse id="main-navbar">
          
          {/* Nav contiene los enlaces principales del menú.
            -me-auto: empuja el contenido siguiente hacia la derecha.
            -ms-lg-4: agrega margen a la izquierda en pantallas grandes.
          */}
          <Nav className="me-auto ms-lg-4">
            
            {/* Enlace a la página de inicio */}
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            {/* Enlace a la sección de juegos */}
            <Nav.Link as={Link} to="/juegos">Juegos</Nav.Link>

            {/* Enlace a la sección de compra de fichas */}
            <Nav.Link as={Link} to="/fichas">Compras de fichas</Nav.Link>

            {/* Enlace a la sección de saldo */}
            <Nav.Link as={Link} to="/saldo">Saldo</Nav.Link>

            {/* Enlace a la sección de información de la empresa o proyecto */}
            <Nav.Link as={Link} to="/empresa">Información</Nav.Link>

            {/* Enlace a la sección de contacto */}
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          </Nav>

          {/* Muestra Login y Registro si no ha iniciado sesión. */}
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

          {/* Muestra Logout si ya inició sesión. */}
          {isLoggedIn && (
            <div className="d-flex gap-2">
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