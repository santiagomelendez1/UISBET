import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FooterCasino() {
  return (
    <footer className="footer-section">
      <Container>
        <Row className="g-4">
          <Col md={6}>
            <h4>UISBET.COM</h4>
            <p className="mb-1">Proyecto académico de programación web</p>
            <p className="mb-1">Correo: contacto@uisbet.com</p>
            <p className="mb-0">Teléfono: +57 300 000 0000</p>
          </Col>

          <Col md={3}>
            <h5>Redes sociales</h5>
            <ul className="footer-links">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter / X</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Accesos</h5>
            <ul className="footer-links">
              <li><Link to="/juegos">Juegos</Link></li>
              <li><Link to="/fichas">Fichas</Link></li>
              <li><Link to="/saldo">Saldo</Link></li>
              <li><Link to="/empresa">Empresa</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterCasino;