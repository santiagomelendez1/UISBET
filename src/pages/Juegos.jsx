import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Juegos() {
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
      title: 'anashe',
      description: 'Espacio reservado para un próximo minijuego del casino.',
      icon: '♠️',
    },
  ];

  return (
    <>
      <NavbarCasino />
      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>Sección del menú</span>
            <h2>Juegos disponibles</h2>
            <p>Aquí solo aparece el apartado de juegos.</p>
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
      <FooterCasino />
    </>
  );
}

export default Juegos;