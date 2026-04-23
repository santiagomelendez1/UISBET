import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Juegos() {
  const navigate = useNavigate();

  const games = [
    {
      title: 'Baccarat',
      description: 'Estructura base del juego, reglas y espacio para lógica futura.',
      icon: '🃏',
      path: '/baccarat'
    },
    {
      title: 'Ruleta',
      description: 'Sección preparada para tablero, apuestas y animación del giro.',
      icon: '🎡',
      path: '/ruleta'
    },
  ];

  return (
    <>
      <NavbarCasino />

      <section 
        className="section-gold py-5" 
        style={{ marginTop: '90px', minHeight: '100vh' }}
      >
        <Container>
          <div className="section-title mb-4 text-center">
            <span>Sección del menú</span>
            <h2>Juegos disponibles</h2>
          </div>

          <Row className="g-4 justify-content-center">
            {games.map((game) => (
              <Col md={6} lg={4} key={game.title}>
                <Card className="game-card h-100 shadow-sm text-center">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    
                    <div>
                      <div className="game-icon" style={{ fontSize: '50px' }}>
                        {game.icon}
                      </div>
                      <Card.Title className="mt-3">
                        {game.title}
                      </Card.Title>
                      <Card.Text>
                        {game.description}
                      </Card.Text>
                    </div>

                    <Button
                      variant="warning"
                      className="w-100 mt-3"
                      onClick={() => navigate(game.path)}
                    >
                      Jugar
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