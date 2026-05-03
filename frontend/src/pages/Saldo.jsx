import { Container, Card, Row, Col } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Saldo() {
  return (
    <>
      <NavbarCasino />
      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <div className="section-title">
                <span>Panel del usuario</span>
                <h2>Saldo y estadísticas</h2>
                <p>Aquí solo aparece el apartado de saldo.</p>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="saldo-card shadow-lg">
                <Card.Body>
                  <Row className="g-3 text-center">
                    <Col xs={6}><div className="stat-box"><h3>1.250</h3><p>Fichas actuales</p></div></Col>
                    <Col xs={6}><div className="stat-box"><h3>12</h3><p>Partidas jugadas</p></div></Col>
                    <Col xs={6}><div className="stat-box"><h3>7</h3><p>Victorias</p></div></Col>
                    <Col xs={6}><div className="stat-box"><h3>58%</h3><p>Efectividad</p></div></Col>
                  </Row>
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

export default Saldo;