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
          <span className='primeraL'>S</span>omos una plataforma de entretenimiento online enfocada en ofrecer una experiencia de casino moderna, intuitiva y accesible para todos los usuarios.
          Nuestra misión es brindar una experiencia de juego dinámica y responsable, combinando tecnología y diseño para garantizar una navegación fluida y atractiva.
          Ofrecemos diferentes juegos de casino, así como la posibilidad de adquirir fichas de forma sencilla dentro de la plataforma.
          La seguridad de nuestros usuarios es una prioridad. Implementamos medidas para proteger la información personal y garantizar una experiencia confiable.
          Promovemos el juego responsable y recomendamos a nuestros usuarios hacer uso consciente de la plataforma.
        </p>

          <p>
            
          </p>
        </Container>
      </section>

      <FooterCasino />
    </>
  );
}

export default Empresa;