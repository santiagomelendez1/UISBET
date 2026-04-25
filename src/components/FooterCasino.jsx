import { Container, Row, Col } from 'react-bootstrap';

// Importa Link de react-router-dom para navegar entre rutas internas
import { Link } from 'react-router-dom';

/**
 * Este componente representa el pie de página del sitio 
 */

function FooterCasino() {
  return (
    <footer className="footer-section">
      
      {/* Container organiza y centra el contenido del footer. */}
      <Container>
        
        {/* Agrega separación entre columnas. */}
        <Row className="g-4">
          
          {/* Primera columna info general.
          md={6}: en pantallas medianas o grandes ocupa (6/12) columnas. */}
          <Col md={6}>
            <h4>UISBET.COM</h4>
            <p className="mb-1">Proyecto académico de programación web</p>
            <p className="mb-1">Correo: contacto@uisbet.com</p>
            <p className="mb-0">Teléfono: +57 300 000 0000</p>
          </Col>

          {/* Segunda columna de enlaces externos (3/12) */}
          <Col md={3}>
            <h5>Redes sociales</h5>
            <ul className="footer-links">
              
              {/* Enlace externo a Facebook.
                
                target="_blank": abre el enlace en una nueva pestaña.
                rel="noreferrer": mejora la seguridad y evita enviar información
                de referencia al sitio externo. */}
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>

              {/* Enlace externo a Twitter / X */}
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Twitter / X
                </a>
              </li>

              {/* Enlace externo a Instagram */}
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </Col>

          {/* Tercera columna de accesos rápidos (3/12) */}
          <Col md={3}>
            <h5>Accesos</h5>

            {/* Lista de enlaces internos del sitio. */}
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