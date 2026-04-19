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
      <Navbar expand="lg" fixed="top" className="uisbet-navbar" variant="dark">
        <Container>
          <Navbar.Brand href="#inicio" className="brand-text">
            UISBET.CO
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto ms-lg-4">
              <Nav.Link href="#inicio">Inicio</Nav.Link>

              <NavDropdown title="Juegos" id="games-dropdown" menuVariant="dark">
                <NavDropdown.Item href="#juegos">Ver juegos</NavDropdown.Item>
                <NavDropdown.Item href="#juegos">Baccarat</NavDropdown.Item>
                <NavDropdown.Item href="#juegos">Ruleta</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#juegos">Próximamente</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="#fichas">Compras de fichas</Nav.Link>
              <Nav.Link href="#saldo">Saldo</Nav.Link>
              <Nav.Link href="#empresa">Información</Nav.Link>
              <Nav.Link href="#contacto">Contacto</Nav.Link>
            </Nav>

            <div className="d-flex gap-2 mt-3 mt-lg-0">
              <Button variant="outline-warning">Login</Button>
              <Button variant="warning">Registro</Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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
                        <Button variant="warning" href="#juegos">
                          Ver juegos
                        </Button>
                        <Button variant="outline-light" href="#empresa">
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
                      <Button variant="warning" href="#fichas">
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
                      <Button variant="outline-light" href="#contacto">
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
                    <Button variant="outline-warning" href="#juegos">
                      Juegos
                    </Button>
                    <Button variant="outline-warning" href="#fichas">
                      Comprar fichas
                    </Button>
                    <Button variant="outline-warning" href="#saldo">
                      Ver saldo
                    </Button>
                    <Button variant="outline-warning" href="#empresa">
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

      {/* Sección de juegos */}
      <section id="juegos" className="section-gold py-5">
        <Container>
          <div className="section-title mb-4">
            <span>Sección del menú</span>
            <h2>Juegos disponibles</h2>
            <p>
              Aquí se deja la estructura visual de los juegos, pero sin programar todavía la lógica
              interna.
            </p>
          </div>

          <Row className="g-4">
            {games.map((game) => (
              <Col md={6} lg={4} key={game.title}>
                <Card className="game-card h-100 shadow-sm">
                  <Card.Body>
                    <div className="game-icon">{game.icon}</div>
                    <Card.Title>{game.title}</Card.Title>
                    <Card.Text>{game.description}</Card.Text>
                    <Button variant="warning" className="w-100">
                      Próximamente
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección de compra de fichas */}
      <section id="fichas" className="section-dark py-5">
        <Container>
          <div className="section-title mb-4">
            <span>Compras</span>
            <h2>Paquetes de fichas</h2>
            <p>
              Se muestran tarjetas de compra para dejar preparada la interfaz del sistema de fichas.
            </p>
          </div>

          <Row className="g-4">
            {chipPackages.map((pack) => (
              <Col md={6} lg={4} key={pack.name}>
                <Card className="chip-card h-100 text-center">
                  <Card.Body>
                    <h4>{pack.name}</h4>
                    <h3 className="gold-number my-3">{pack.chips}</h3>
                    <p className="mb-4">Precio estimado: {pack.price}</p>
                    <Button variant="outline-warning">Comprar</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección de saldo */}
      <section id="saldo" className="section-gold py-5">
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <div className="section-title">
                <span>Panel del usuario</span>
                <h2>Saldo y estadísticas</h2>
                <p>
                  Espacio reservado para mostrar más adelante el perfil del usuario, historial de
                  partidas y estadísticas personales.
                </p>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="saldo-card shadow-lg">
                <Card.Body>
                  <Row className="g-3 text-center">
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>1.250</h3>
                        <p>Fichas actuales</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>12</h3>
                        <p>Partidas jugadas</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>7</h3>
                        <p>Victorias</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>58%</h3>
                        <p>Efectividad</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Información de la empresa */}
      <section id="empresa" className="section-dark py-5">
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={7}>
              <div className="section-title mb-4">
                <span>Sobre nosotros</span>
                <h2>Información de UISBET.COM</h2>
              </div>

              <p className="dropcap-text">
                UISBET.COM es una propuesta académica de casino virtual diseñada para aplicar
                conceptos de programación web, diseño responsive e interfaces modernas. En esta fase
                inicial se construyó una portada clara, atractiva y fácil de navegar.
              </p>

              <p>
                La idea del proyecto es integrar registro, login, compra de fichas, juegos y un panel
                personalizado, pero por ahora la página solo presenta la estructura base del sistema.
              </p>

              <Accordion defaultActiveKey="0" className="faq-accordion mt-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>¿Qué se implementó en esta primera fase?</Accordion.Header>
                  <Accordion.Body>
                    Se implementó el home, el menú principal, tarjetas de juegos, compra de fichas,
                    saldo visual, información de la empresa y formulario de contacto.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>¿Qué falta por implementar?</Accordion.Header>
                  <Accordion.Body>
                    Falta la lógica real del login, las rutas privadas, la conexión con base de datos,
                    el CAPTCHA y el funcionamiento interno de los juegos.
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>¿Por qué se usó Bootstrap?</Accordion.Header>
                  <Accordion.Body>
                    Porque permite construir interfaces ordenadas, responsive y fáciles de explicar en
                    una exposición gracias a su sistema de filas, columnas y componentes listos.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>

            <Col lg={5}>
              <Card className="info-card shadow-sm">
                <Card.Body>
                  <h4>Espacio multimedia</h4>
                  <div className="video-placeholder">
                    Aquí puedes insertar después un video institucional o una presentación del proyecto.
                  </div>

                  <hr />

                  <h5>Principios de diseño aplicados</h5>
                  <ul className="mb-0">
                    <li>Contraste entre negro y dorado</li>
                    <li>Menú fijo para facilitar la navegación</li>
                    <li>Jerarquía visual con títulos y tarjetas</li>
                    <li>Diseño adaptable a distintos dispositivos</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contacto con formulario */}
      <section id="contacto" className="section-gold py-5">
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div className="section-title mb-4">
                <span>Contáctanos</span>
                <h2>Formulario de contacto</h2>
                <p>
                  Este formulario usa <code>Form</code> de React-Bootstrap, tal como lo pide la guía.
                </p>
              </div>

              <Card className="contact-card shadow-sm">
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3" controlId="formNombre">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type="text" placeholder="Ingresa tu nombre" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCorreo">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control type="email" placeholder="correo@ejemplo.com" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formMensaje">
                      <Form.Label>Mensaje</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="Escribe tu mensaje" />
                    </Form.Group>

                    <Button variant="warning" type="submit">
                      Enviar mensaje
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <div className="section-title mb-4">
                <span>Equipo</span>
                <h2>Integrantes del proyecto</h2>
                <p>
                  Al hacer clic en cada integrante se abre un modal con sus datos básicos y una foto.
                </p>
              </div>

              <Row className="g-3">
                {teamMembers.map((member) => (
                  <Col sm={6} xl={4} key={member.id}>
                    <Card className="team-card h-100 text-center">
                      <Card.Body>
                        <div className="team-avatar">{member.name.charAt(member.name.length - 1)}</div>
                        <h5>{member.name}</h5>
                        <p>{member.role}</p>
                        <Button variant="outline-warning" size="sm" onClick={() => openMemberModal(member)}>
                          Ver datos
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
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
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
              </ul>
            </Col>

            <Col md={3}>
              <h5>Accesos</h5>
              <ul className="footer-links">
                <li><a href="#juegos">Juegos</a></li>
                <li><a href="#fichas">Fichas</a></li>
                <li><a href="#saldo">Saldo</a></li>
                <li><a href="#empresa">Empresa</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>

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
