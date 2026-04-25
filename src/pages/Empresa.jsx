import { Container, Card, Row, Col, Accordion } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';

/**
 * Este componente representa la sección "Información" o "Sobre nosotros"
 * del sitio UISBET.COM.
 */
function Empresa() {
  return (
    <>
      <NavbarCasino />

      {/*
        Section representa el contenido principal de la página "Empresa".
        
        className:
        - section-dark: Aplica fondo o estilo oscuro.
        - py-5: Agrega padding vertical.
        
        style:
        - marginTop: '90px' deja un espacio superior para que el contenido
          no quede tapado por el nav.
        - minHeight: '100vh' asegura que la sección tenga como mínimo
          la altura completa de la ventana.
      */}
      <section
        className="section-dark py-5"
        style={{ marginTop: '90px', minHeight: '100vh' }}
      >
        {/* Container centra el contenido */}
        <Container>
          
          {/* Título principal con margen inferior. */}
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