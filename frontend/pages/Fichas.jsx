import { Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { useContext, useEffect, useState } from 'react';

import { apiRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';

/**
 * Compra de fichas conectada al backend.
 */
function Fichas() {
  const [chipPackages, setChipPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  /* Carga paquetes desde la BD. */
  const loadPackages = async () => {
    const data = await apiRequest('/packages');
    setChipPackages(data);
  };

  useEffect(() => {
    loadPackages();
  }, []);

  /* Registra una compra. */
  const handlePurchase = async (e) => {
    e.preventDefault();
    const reference = e.target.reference.value;

    try {
      await apiRequest(
        '/purchases',
        {
          method: 'POST',
          body: JSON.stringify({
            package_id: selectedPackage.id,
            payment_reference: reference,
          }),
        },
        token
      );

      setMessage('Compra registrada correctamente.');
      setShowModal(false);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <>
      <NavbarCasino />

      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>Compras</span>
            <h2>Paquetes de fichas</h2>
          </div>

          {message && <p className="text-success">{message}</p>}

          <Row className="g-4">
            {chipPackages.map((pack) => (
              <Col md={6} lg={4} key={pack.id}>
                <Card className="chip-card h-100 text-center">
                  <Card.Body>
                    <h4>{pack.name}</h4>
                    <h3 className="gold-number my-3">{pack.chips} fichas</h3>
                    <p className="mb-2">Precio: ${Number(pack.price).toLocaleString('es-CO')}</p>
                    <p className="mb-4">{pack.description}</p>

                    <Button
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedPackage(pack);
                        setShowModal(true);
                      }}
                    >
                      Comprar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Modal del pago. */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Formulario de pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePurchase}>
            <p><strong>Paquete:</strong> {selectedPackage?.name}</p>

            <Form.Group className="mb-3">
              <Form.Label>Referencia de pago</Form.Label>
              <Form.Control name="reference" type="text" placeholder="Ej: TRANS-12345" required />
            </Form.Group>

            <Button type="submit" variant="warning" className="w-100">
              Confirmar compra
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <FooterCasino />
    </>
  );
}

export default Fichas;