import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Fichas() {
  const chipPackages = [
    { name: 'PAR', chips: '100 fichas', price: '$5.000' },
    { name: 'DOBLE PAR', chips: '500 fichas', price: '$20.000' },
    { name: 'TRIO', chips: '1.000 fichas', price: '$35.000' },
    { name: 'ESCALERA', chips: '2.000 fichas', price: '$60.000' },
    { name: 'COLOR', chips: '4.000 fichas', price: '$100.000' },
    { name: 'FULL HOUSE', chips: '8.000 fichas', price: '$180.000' }
    
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
              <Col md={6} lg={4} key={pack.name}>
                <Card className="chip-card h-100 text-center">
                  <Card.Body>
                    <h4>{pack.name}</h4>
                    <h3 className="gold-number my-3">{pack.chips}</h3>
                    <p className="mb-4">Precio: {pack.price}</p>
                    <Button variant="outline-warning">Comprar</Button>
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

export default Fichas;