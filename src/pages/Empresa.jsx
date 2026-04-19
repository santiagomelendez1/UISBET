import { Container, Card, Row, Col, Accordion } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Empresa() {
  return (
    <>
      <NavbarCasino />
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={7}>
              <div className="section-title mb-4">
                <span>Sobre nosotros</span>
                <h2>Información de UISBET.COM</h2>
              </div>

              <p className="dropcap-text">
                UISBET.COM es una propuesta académica de casino virtual diseñada para aplicar conceptos
                de programación web, diseño responsive e interfaces modernas.
              </p>

              <p>
                La idea del proyecto es integrar registro, login, compra de fichas, juegos y un panel
                personalizado.
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
              </Accordion>
            </Col>

            <Col lg={5}>
              <Card className="info-card shadow-sm">
                <Card.Body>
                  <h4>Principios de diseño aplicados</h4>
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
      <FooterCasino />
    </>
  );
}

export default Empresa;