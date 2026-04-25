import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

/**
 * Sección de juegos. Su función es mostrar los juegos disponibles
 * y permitir al usuario navegar hacia cada uno.
 */
function Juegos() {
  /**
   * Hook para navegar entre rutas de forma programada.
   */
  const navigate = useNavigate();

  /**
   * Arreglo con la información de los juegos disponibles.
   * Cada objeto contiene nombre, descripción, ícono y ruta.
   */
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
      {/* Barra de navegación superior de la página. */}
      <NavbarCasino />

      {/* Sección principal de juegos con margen superior y altura mínima de pantalla. */}
      <section
        className="section-gold py-5"
        style={{ marginTop: '90px', minHeight: '100vh' }}
      >
        <Container>
          
          {/* Título principal de la sección centrado. */}
          <div className="section-title mb-4 text-center">
            <span>Sección del menú</span>
            <h2>Juegos disponibles</h2>
          </div>

          {/* Fila que organiza las cards de juegos con separación y centrado. */}
          <Row className="g-4 justify-content-center">
            
            {/* Recorre el arreglo games y crea una card por cada juego. */}
            {games.map((game) => (
              <Col md={6} lg={4} key={game.title}>
                
                {/* Card de cada juego con altura completa, sombra y texto centrado. */}
                <Card className="game-card h-100 shadow-sm text-center">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    
                    {/* Contenedor con el ícono, título y descripción del juego. */}
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

                    {/* Botón para navegar a la ruta del juego seleccionado. */}
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