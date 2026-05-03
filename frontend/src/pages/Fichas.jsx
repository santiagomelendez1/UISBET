import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import Formulario from './Formulario';
import { useState } from 'react';
function Fichas() {
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null)
  const chipPackages = [
  { nombre: 'PAR',        fichas: 100,   precio: '$5.000' },
  { nombre: 'DOBLE PAR',  fichas: 500,   precio: '$20.000' },
  { nombre: 'TRIO',       fichas: 1000,  precio: '$35.000' },
  { nombre: 'ESCALERA',   fichas: 2000,  precio: '$60.000' },
  { nombre: 'COLOR',      fichas: 4000,  precio: '$100.000' },
  { nombre: 'FULL HOUSE', fichas: 8000,  precio: '$180.000' },
];
  return (
    <>
      <NavbarCasino />
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>Compras</span>
            <h2>Paquetes de fichas</h2>
            <div style={{display:'flex' , justifyContent :"center" }}>
            <p>Decide bien, apuesta mejor. </p>
            </div>
          </div>
        
          <Row className="g-4">
            {chipPackages.map((pack) => (
              <Col md={6} lg={4} key={pack.nombre}>
                <Card className="chip-card h-100 text-center">
                  <Card.Body>
                    <h4>{pack.nombre}</h4>
                    <h3 className="gold-number my-3">{pack.fichas + " fichas"}</h3>
                    <p className="mb-4">Precio: {pack.precio}</p>
                    <Button variant="outline-warning" onClick={() => setPaqueteSeleccionado(pack)}>Comprar</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          
          </Row>  
        </Container>
      </section>
      <Formulario
      paquete = {paqueteSeleccionado}
      onClose ={() => setPaqueteSeleccionado(null)}
      >

      </Formulario>
      <FooterCasino />
    </>
  );
}

export default Fichas;