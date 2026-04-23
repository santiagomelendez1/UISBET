import { Container, Card, Row, Col, Accordion } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

function Empresa() {
  return (
    <>
      <NavbarCasino />
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>Sobre nosotros</span>
            <h2>Información de UISBET.COM</h2>
          </div>

          <p className="dropcap-text">
            UISBET.COM es una propuesta académica de casino virtual diseñada para aplicar conceptos
            de programación web, diseño responsive e interfaces modernas.
          </p>

          <p>
            La idea del proyecto es integrar registro, login, compra de fichas, juegos y un panel
            personalizado.
          </p>
          
        </Container>
      </section>
      <FooterCasino />
    </>
  );
}

export default Empresa;