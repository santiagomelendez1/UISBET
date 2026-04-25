// Importa Link para navegar entre rutas sin recargar la página.
import { Link } from 'react-router-dom';

import NavbarCasino from './NavbarCasino';
import FooterCasino from './FooterCasino';
import { useState } from 'react';

// Importa componentes de React-Bootstrap necesarios.
import {
  Button,
  Card,
  Carousel,
  Col,
  Collapse,
  Container,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';

import '../styles/Home.css';

/**
 * Página de incio que muestra: una barra de navegación superior, 
 * un carrusel de presentación,
 * una tarjeta lateral con saldo de demostración,
 * una sección de características del sitio,
 * un pie de página.
 */
function Home() {

// Estado que controla si el panel de detalles del saldo está visible o colapsado.
  
  const [openInfo, setOpenInfo] = useState(false);

  /**
   * Popover (tarjeta emergente informativa) sobre el saldo de demostración.
   * Se muestra al pasar el cursor en el botón Info.
   */
  const saldoPopover = (
    <Popover id="popover-saldo">
      <Popover.Header as="h3">Saldo actual</Popover.Header>
      <Popover.Body>
        Aqui encuentras el saldo disponible que posees.
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {/* Barra de navegación superior fija del sitio */}
      <NavbarCasino />

      {/* Sección principal de bienvenida */}
      <header id="inicio" className="hero-section">
        <Container>
          <Row className="g-4 align-items-stretch">
            {/* Columna izquierda: carrusel principal */}
            <Col lg={8}>
              <Carousel fade className="hero-carousel shadow-lg rounded-4 overflow-hidden">
                {/* Primera diapositiva */}
                <Carousel.Item>
                  <div className="carousel-panel panel-one">
                    <div className="carousel-overlay">
                      <span className="small-label">Casino virtual</span>
                      <h1>Bienvenido a UISBET.COM</h1>
                      <p>
                        Explora nuestro casino virtual con estilo moderno donde podrás
                        divertirte y ganar en juegos como Baccarat y la ruleta.
                      </p>

                      {/* Botones de navegación hacia otras secciones del sitio */}
                      <div className="d-flex gap-2 flex-wrap items-center justify-content-center">
                        <Button as={Link} to="/juegos" variant="warning">
                          Ver juegos
                        </Button>
                        <Button as={Link} to="/empresa" variant="outline-light">
                          Conocer más
                        </Button>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>

                {/* Segunda diapositiva */}
                <Carousel.Item>
                  <div className="carousel-panel panel-two">
                    <div className="carousel-overlay">
                      <span className="small-label">Compra rápida</span>
                      <h2>Gestiona tus fichas</h2>
                      <p>
                        Encuentra nuestros distintos paquetes de compra de fichas para seguir jugando.
                      </p>
                      <Button as={Link} to="/fichas" variant="warning">
                        Ir a fichas
                      </Button>
                    </div>
                  </div>
                </Carousel.Item>

                {/* Tercera diapositiva */}
                <Carousel.Item>
                  <div className="carousel-panel panel-three">
                    <div className="carousel-overlay">
                      <span className="small-label">Información del proyecto</span>
                      <h2>Apuesta y gana</h2>
                      <p>
                        El proyecto UISBET.COM nace de la idea de 4 programadores quienes 
                        apostaron por un 5.0 en WEB.
                      </p>
                      <Button as={Link} to="/contacto" variant="outline-light">
                        Contacto
                      </Button>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </Col>

            {/* Columna derecha: tarjeta de saldo demo */}
            <Col lg={4}>
              <Card className="side-card shadow-sm h-100">
                <Card.Body>
                  {/* Encabezado de la tarjeta con botón de información */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h3 className="mb-0">Saldo actual</h3>

                    {/* Popover que explica el propósito del saldo visual */}
                    <OverlayTrigger
                      trigger={['hover', 'focus']}
                      placement="left"
                      overlay={saldoPopover}
                    >
                      <Button variant="warning" size="sm">
                        Info
                      </Button>
                    </OverlayTrigger>
                  </div>

                  {/* Valor visual del saldo del usuario */}
                  <h2 className="gold-number mt-3">1.250 fichas</h2>
                  <p className="text-muted-light">
                    Podrás multiplicar tus fichas en nuestros juegos disponibles.
                  </p>

                  {/* Botón que abre o cierra los detalles del saldo */}
                  <Button
                    variant="outline-light"
                    className="w-100"
                    onClick={() => setOpenInfo(!openInfo)}
                    aria-controls="collapse-saldo"
                    aria-expanded={openInfo}
                  >
                    Ver detalles
                  </Button>

                  {/* Sección desplegable con información adicional */}
                  <Collapse in={openInfo}>
                    <div id="collapse-saldo" className="collapse-card mt-3">
                      <ul className="mb-0">
                        <li>Espacio para historial de compras</li>
                        <li>Espacio para resultados de partidas</li>
                      </ul>
                    </div>
                  </Collapse>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Sección de características principales del sitio */}
      <section className="section-dark py-5">
        <Container>
          <Row className="g-4">
            {/* Tarjeta 1 */}
            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="feature-icon">🎯</div>
                  <h4>Navegación clara</h4>
                  <p>
                    Sitio Web ordenado e intuitivo para acceder a las secciones de tu interés.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Tarjeta 2 */}
            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="feature-icon">💸</div>
                  <h4>Compra de fichas</h4>
                  <p>
                    Adquiere tus fichas fácil y rápido para empezar a ganar.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            {/* Tarjeta 3 */}
            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                  <div className="feature-icon">📱</div>
                  <h4>Diseño responsive</h4>
                  <p>
                    Disfruta el casino virtual desde computador, tablet y celular.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pie de página del sitio */}
      <FooterCasino />
    </>
  );
}

export default Home;