import { useContext, useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/* Página de saldo del usuario. */
function Saldo() {
  /* Obtiene el token de la sesión actual. */
  const { token } = useContext(AuthContext);

  /* Estados de la sección. */
  const [stats, setStats] = useState({ total_chips: 0 });
  const [balance, setBalance] = useState(0);
  const [purchases, setPurchases] = useState([]);

  /* Carga estadísticas, compras y saldo del usuario al mismo tiempo (Promise.all). */
  useEffect(() => {
    const loadData = async () => {
      const [statsData, purchasesData, meData] = await Promise.all([
        apiRequest('/purchases/stats/mine', {}, token),
        apiRequest('/purchases/mine', {}, token),
        apiRequest('/auth/me', {}, token),
      ]);

      setStats(statsData);
      setPurchases(purchasesData);
      setBalance(meData.balance ?? 0);
    };

    loadData();
  }, [token]);

  return (
    <>
      {/* Barra de navegación superior. */}
      <NavbarCasino />

      {/* Sección principal del saldo. */}
      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4 align-items-start">
            
            {/* Columna izquierda con resumen del saldo. */}
            <Col lg={5}>
              <div className="section-title">
                <span>Panel del usuario</span>
                <h2>SALDO</h2>
              </div>

              <Card className="saldo-card shadow-lg mt-4">
                <Card.Body>
                  <Row className="g-3 text-center">
                    
                    {/* Muestra el total de fichas compradas. */}
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>{stats.total_chips}</h3>
                        <p>Fichas compradas</p>
                      </div>
                    </Col>

                    {/* Muestra el saldo actual del usuario. */}
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>{balance.toLocaleString('es-CO')}</h3>
                        <p>Saldo actual</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Columna derecha con el historial de compras. */}
            <Col lg={7}>
              <Card className="feature-card">
                <Card.Body>
                  <h4 className="mb-3">Historial de compras</h4>

                  <Table striped bordered responsive variant="dark">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Paquete</th>
                        <th>Fichas</th>
                        <th>Precio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Recorre las compras y crea una fila por cada una. */}
                      {purchases.map((purchase) => (
                        <tr key={purchase.id}>
                          <td>{purchase.id}</td>
                          <td>{purchase.package_name}</td>
                          <td>{purchase.chips}</td>
                          <td>{purchase.price}</td>
                          <td>{purchase.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pie de página del sitio. */}
      <FooterCasino />
    </>
  );
}

export default Saldo;