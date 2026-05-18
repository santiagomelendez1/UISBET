import { Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';

/* Compra de fichas conectada al backend. */
function Fichas() {
  /* Estados de la sección. */
  const [chipPackages, setChipPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  /* Obtiene el token de la sesión actual. */
  const { token } = useContext(AuthContext);

  /* Carga los paquetes desde el backend. */
  const loadPackages = async () => {
    const data = await apiRequest('/packages');
    setChipPackages(data);
  };

  /* Carga los paquetes al abrir la página. */
  useEffect(() => {
    loadPackages();
  }, []);

  /* Registra una compra en el backend. */
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

      /* Muestra mensaje de éxito y cierra el modal. */
      setMessage('Compra registrada correctamente.');
      setShowModal(false);
    } catch (error) {
      /* Muestra el mensaje de error recibido. */
      setMessage(error.message);
    }
  };

  return (
    <>
      {/* Barra de navegación superior. */}
      <NavbarCasino />

      {/* Sección principal de compra de fichas. */}
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          
          {/* Título principal de la sección. */}
          <div className="section-title mb-4">
            <span>Compras</span>
            <h2>Paquetes de fichas</h2>
          </div>

          {/* Mensaje de confirmación o error. */}
          {message && <p className="text-success">{message}</p>}

          {/* Cards de paquetes disponibles. */}
          <Row className="g-4">
            {chipPackages.map((pack) => (
              <Col md={6} lg={4} key={pack.id}>
                <Card className="chip-card h-100 text-center">
                  <Card.Body>
                    <h4>{pack.name}</h4>
                    <h3 className="gold-number my-3">{pack.chips} fichas</h3>
                    <p className="mb-2">Precio: ${Number(pack.price).toLocaleString('es-CO')}</p>
                    <p className="mb-4">{pack.description}</p>

                    {/* Botón para seleccionar el paquete y abrir el modal. */}
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
            
            {/* Muestra el nombre del paquete seleccionado. */}
            <p><strong>Paquete:</strong> {selectedPackage?.name}</p>

            {/* Campo para ingresar la referencia de pago. */}
            <Form.Group className="mb-3">
              <Form.Label>Referencia de pago</Form.Label>
              <Form.Control
                name="reference"
                type="text"
                placeholder="Ej: TRANS-12345"
                required
              />
            </Form.Group>

            {/* Botón para confirmar la compra. */}
            <Button type="submit" variant="warning" className="w-100">
              Confirmar compra
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Pie de página del sitio. */}
      <FooterCasino />
    </>
  );
}

export default Fichas;