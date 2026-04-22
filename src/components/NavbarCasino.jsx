import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarCasino() {
  return (
    <Navbar expand="lg" fixed="top" className="uisbet-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text">
          UISBET.COM
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto ms-lg-4">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            <NavDropdown title="Juegos" id="games-dropdown" menuVariant="dark">
              <NavDropdown.Item as={Link} to="/juegos">Ver juegos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/juegos">Baccarat</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/juegos">Ruleta</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/juegos">Próximamente</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/fichas">Compras de fichas</Nav.Link>
            <Nav.Link as={Link} to="/saldo">Saldo</Nav.Link>
            <Nav.Link as={Link} to="/empresa">Información</Nav.Link>
            <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
          </Nav>

          <div className="d-flex gap-2 mt-3 mt-lg-0">
            {/* Botones de Login y Registro, usando link */}
            <Button as={Link} to="/login" variant="outline-warning">Login</Button>
            <Button as={Link} to="/registro" variant="warning">Registro</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCasino;