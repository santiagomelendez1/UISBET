import { useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Contacto() {
  const [show, setShow] = useState(false);

  return (
    <>
      <NavbarCasino />
      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div className="section-title mb-4">
                <span>Contáctanos</span>
                <h2>Formulario de CONTACTO</h2>
              </div>

              <Card className="contact-card shadow-sm">
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control type="text" placeholder="Ingresa tu nombre" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control type="email" placeholder="correo@ejemplo.com" />
                    </Form.Group>

                    <Form.Group className="mb-3">
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
                <p>Puedes mostrar los datos del equipo en un modal.</p>
              </div>

              <Button variant="outline-warning" onClick={() => setShow(true)}>
                Ver integrante de ejemplo
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Datos del integrante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Nombre:</strong> Integrante 1</p>
          <p><strong>Rol:</strong> Frontend y diseño</p>
          <p><strong>Correo:</strong> integrante1@uisbet.com</p>
        </Modal.Body>
      </Modal>

      <FooterCasino />
    </>
  );
}

export default Contacto;