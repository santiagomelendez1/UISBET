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
      description: '¿quién sacará el número mayor?',
      icon: '🂡',
      path: '/baccarat',
      videoId: 'xhYgXZ51P4M'
    },
    {
      title: 'Ruleta',
      description: 'Prueba tu suerte y haz tu apuesta ganadora',
      icon: '☘',
      path: '/ruleta',
      videoId: 'MMlyoS9qdvo'
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

                    {/* Video tutorial del juego */}
                    <div className="mt-3">
                      <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Tutorial</p>
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${game.videoId}`}
                          title={`Tutorial de ${game.title}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                        />
                      </div>
                    </div>
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