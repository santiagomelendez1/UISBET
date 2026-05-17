import { useContext, useEffect, useState } from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/**
 * Panel de saldo y estadísticas.
 */
function Saldo() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ total_chips: 0, total_purchases: 0, paid_count: 0 });
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const statsData = await apiRequest('/purchases/stats/mine', {}, token);
      const purchasesData = await apiRequest('/purchases/mine', {}, token);
      setStats(statsData);
      setPurchases(purchasesData);
    };

    loadData();
  }, [token]);

  return (
    <>
      <NavbarCasino />

      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4 align-items-start">
            <Col lg={5}>
              <div className="section-title">
                <span>Panel del usuario</span>
                <h2>Saldo y estadísticas</h2>
                <p>Aquí aparece el apartado de saldo alimentado por la base de datos.</p>
              </div>

              <Card className="saldo-card shadow-lg mt-4">
                <Card.Body>
                  <Row className="g-3 text-center">
                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>{stats.total_chips}</h3>
                        <p>Fichas actuales</p>
                      </div>
                    </Col>

                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>{stats.total_purchases}</h3>
                        <p>Compras realizadas</p>
                      </div>
                    </Col>

                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>{stats.paid_count}</h3>
                        <p>Pagadas</p>
                      </div>
                    </Col>

                    <Col xs={6}>
                      <div className="stat-box">
                        <h3>
                          {stats.total_purchases
                            ? Math.round((stats.paid_count / stats.total_purchases) * 100)
                            : 0}%
                        </h3>
                        <p>Efectividad</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

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

      <FooterCasino />
    </>
  );
}

export default Saldo;