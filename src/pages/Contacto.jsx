import { useState } from 'react';
import { Container, Card, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Contacto() {
  const [show, setShow] = useState(false);
  const [integrante, setIntegrante] = useState(null);


  return (
    <>
      <NavbarCasino />
      {/*se define una seccion de la pagina con clases de bootstrap*/}
      <section className="section-gold py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <Row className="g-4">

            <Col lg={12} className="text-center">
              <div className="section-title mb-4">
                <span>Equipo</span>
                <h2>Integrantes del proyecto</h2>
                <h6 className="text-center">Haz click para ver más información</h6>
              </div>
              {/*se define un boton con el estilo de bootstrap, tiene una funcion flecha que se activa cuando se da click,
              esta cambia el estado de show a true, lo que hace que active una ventana emergente */}
              <div className="d-flex flex-column align-items-center gap-2">
                <Button style={{ width: '200px' }} variant="outline-warning" onClick={() => { setIntegrante(1); setShow(true); }}>
                  Santiago Meléndez
                </Button>
                <Button style={{ width: '200px' }} variant="outline-warning" onClick={() => { setIntegrante(2); setShow(true); }}>
                  Iván  Herrera
                </Button>
                <Button style={{ width: '200px' }} variant="outline-warning" onClick={() => { setIntegrante(3); setShow(true); }}>
                  Santiago Fonseca
                </Button>
                <Button style={{ width: '200px' }} variant="outline-warning" onClick={() => { setIntegrante(4); setShow(true); }}>
                  Diego Niño
                </Button>
              </div>
            </Col>

          </Row>
        </Container>
      </section>
                
      {/*se define un modal o pagina emergente de bootstrap*/}
      {/*funcion felcha que cambia de estado de show a flase para cerrar la ventana emergente*/}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Datos del integrante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*se define una variable integrante, esta se puede cambiar para mostrar los datos de cada integrante del equipo*/}
          {integrante === 1 && (
            <>
              <p><strong>Nombre:</strong> Santiago Meléndez</p>
              <p><strong>Rol:</strong> Coordinador y full-stack developer</p>
              <p><strong>Correo:</strong> santiago.melendez@uisbet.com</p>
            </>
          )}
          {integrante === 2 && (
            <>
              <p><strong>Nombre:</strong> Iván Herrera</p>
              <p><strong>Rol:</strong> Frontend y diseño</p>
              <p><strong>Correo:</strong> ivan.herrera@uisbet.com</p>
            </>
          )}
          {integrante === 3 && (
            <>
              <p><strong>Nombre:</strong> Santiago Fonseca</p>
              <p><strong>Rol:</strong> Frontend y diseño</p>
              <p><strong>Correo:</strong> santiago.fonseca@uisbet.com</p>
            </>
          )}
          {integrante === 4 && (
            <>
              <p><strong>Nombre:</strong> Diego Niño</p>
              <p><strong>Rol:</strong> Backend y base de datos</p>
              <p><strong>Correo:</strong> diego.nino@uisbet.com</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      <FooterCasino />
    </>
  );
}

export default Contacto;