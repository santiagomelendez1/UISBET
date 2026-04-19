import { Link } from 'react-router-dom';
import NavbarCasino from './NavbarCasino';
import FooterCasino from './FooterCasino';
import { useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Carousel,
  Col,
  Collapse,
  Container,
  Form,
  Modal,
  Nav,
  Navbar,
  NavDropdown,
  OverlayTrigger,
  Popover,
  Row,
} from 'react-bootstrap';

const teamMembers = [
  {
    id: 1,
    name: 'Integrante 1',
    role: 'Frontend y diseño',
    email: 'integrante1@uisbet.com',
    phone: '300 000 0001',
    photo: 'https://via.placeholder.com/250x250/111111/D4AF37?text=Integrante+1',
  },
  {
    id: 2,
    name: 'Integrante 2',
    role: 'Lógica y validaciones',
    email: 'integrante2@uisbet.com',
    phone: '300 000 0002',
    photo: 'https://via.placeholder.com/250x250/111111/D4AF37?text=Integrante+2',
  },
  {
    id: 3,
    name: 'Integrante 3',
    role: 'Documentación y pruebas',
    email: 'integrante3@uisbet.com',
    phone: '300 000 0003',
    photo: 'https://via.placeholder.com/250x250/111111/D4AF37?text=Integrante+3',
  },
];

const games = [
  {
    title: 'Baccarat',
    description: 'Estructura base del juego, reglas y espacio para lógica futura.',
    icon: '🃏',
  },
  {
    title: 'Ruleta',
    description: 'Sección preparada para tablero, apuestas y animación del giro.',
    icon: '🎡',
  },
  {
    title: 'Blackjack',
    description: 'Espacio reservado para un próximo minijuego del casino.',
    icon: '♠️',
  },
];

const chipPackages = [
  { name: 'Paquete Básico', chips: '100 fichas', price: '$5.000' },
  { name: 'Paquete Intermedio', chips: '500 fichas', price: '$20.000' },
  { name: 'Paquete Premium', chips: '1.000 fichas', price: '$35.000' },
];

function Home() {
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const saldoPopover = (
    <Popover id="popover-saldo">
      <Popover.Header as="h3">Saldo de demostración</Popover.Header>
      <Popover.Body>
        En esta primera fase el saldo es visual. Más adelante se conectará con el registro,
        el login y los resultados de los juegos.
      </Popover.Body>
    </Popover>
  );

  const openMemberModal = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  return (
    <>
      {/* Barra de navegación fija */}
      <NavbarCasino />

      {/* Portada principal */}
      <header id="inicio" className="hero-section">
        <Container>
          <Row className="g-4 align-items-stretch">
            <Col lg={8}>
              <Carousel fade className="hero-carousel shadow-lg rounded-4 overflow-hidden">
                <Carousel.Item>
                  <div className="carousel-panel panel-one">
                    <div className="carousel-overlay">
                      <span className="small-label">Casino virtual</span>
                      <h1>Bienvenido a UISBET.COM</h1>
                      <p>
                        Explora nuestro casino virtual con estilo moderno, diseño responsive y
                        espacio listo para futuras funcionalidades.
                      </p>
                      <div className="d-flex gap-2 flex-wrap">
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

                <Carousel.Item>
                  <div className="carousel-panel panel-two">
                    <div className="carousel-overlay">
                      <span className="small-label">Compra rápida</span>
                      <h2>Gestiona tus fichas</h2>
                      <p>
                        La sección de compras ya está preparada para mostrar paquetes, saldo y
                        futuras actualizaciones en tiempo real.
                      </p>
                      <Button as={Link} to="/fichas" variant="warning">
                        Ir a fichas
                      </Button>
                    </div>
                  </div>
                </Carousel.Item>

                <Carousel.Item>
                  <div className="carousel-panel panel-three">
                    <div className="carousel-overlay">
                      <span className="small-label">Información del proyecto</span>
                      <h2>Diseño claro y explicable</h2>
                      <p>
                        Esta versión inicial fue hecha con Bootstrap y React para que sea fácil de
                        entender y presentar en la exposición.
                      </p>
                      <Button as={Link} to="/contacto" variant="outline-light">
                        Contacto
                      </Button>
                    </div>
                  </div>
                </Carousel.Item>
              </Carousel>
            </Col>

            <Col lg={4}>
              {/* <Card className="side-card shadow-sm mb-4 h-100 quick-card">
                <Card.Body>
                  <h3>Accesos rápidos</h3>
                  <p className="text-muted-light">
                    Menú sencillo para navegar por las secciones principales del home.
                  </p>

                  <div className="quick-links d-grid gap-2">
                    <Button as={Link} to="/juegos" variant="outline-warning">
                      Juegos
                    </Button>
                    <Button as={Link} to="/fichas" variant="outline-warning">
                      Comprar fichas
                    </Button>
                    <Button as={Link} to="/saldo" variant="outline-warning">
                      Ver saldo
                    </Button>
                    <Button as={Link} to="/empresa" variant="outline-warning">
                      Información empresa
                    </Button>
                  </div>
                </Card.Body>
              </Card> */}

              <Card className="side-card shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h3 className="mb-0">Saldo demo</h3>

                    <OverlayTrigger trigger={["hover", "focus"]} placement="left" overlay={saldoPopover}>
                      <Button variant="warning" size="sm">
                        Info
                      </Button>
                    </OverlayTrigger>
                  </div>

                  <h2 className="gold-number mt-3">1.250 fichas</h2>
                  <p className="text-muted-light">
                    Valor visual para mostrar cómo quedará el panel del usuario cuando exista login
                    real.
                  </p>

                  <Button
                    variant="outline-light"
                    className="w-100"
                    onClick={() => setOpenInfo(!openInfo)}
                    aria-controls="collapse-saldo"
                    aria-expanded={openInfo}
                  >
                    Ver detalles
                  </Button>

                  <Collapse in={openInfo}>
                    <div id="collapse-saldo" className="collapse-card mt-3">
                      <ul className="mb-0">
                        <li>Saldo inicial de demostración</li>
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

      {/* Tres columnas de presentación */}
      <section className="section-dark py-5">
        <Container>
          <Row className="g-4">
            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body>
                  <div className="feature-icon">🎯</div>
                  <h4>Navegación clara</h4>
                  <p>
                    Barra fija, menú ordenado y acceso rápido a las secciones más importantes del
                    sitio.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body>
                  <div className="feature-icon">💳</div>
                  <h4>Compra de fichas</h4>
                  <p>
                    Estructura visual lista para conectar más adelante con validaciones y operaciones
                    del sistema.
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="feature-card h-100 text-center">
                <Card.Body>
                  <div className="feature-icon">📱</div>
                  <h4>Diseño responsive</h4>
                  <p>
                    Distribución adaptable para computador, tablet y celular usando la grilla de
                    Bootstrap.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <FooterCasino />

      {/* Modal con datos del integrante */}
      <Modal show={showMemberModal} onHide={() => setShowMemberModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Datos del integrante</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedMember && (
            <div className="text-center">
              <img
                src={selectedMember.photo}
                alt={selectedMember.name}
                className="img-fluid rounded-circle mb-3 member-photo"
              />
              <h4>{selectedMember.name}</h4>
              <p className="mb-1"><strong>Rol:</strong> {selectedMember.role}</p>
              <p className="mb-1"><strong>Correo:</strong> {selectedMember.email}</p>
              <p className="mb-0"><strong>Teléfono:</strong> {selectedMember.phone}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
