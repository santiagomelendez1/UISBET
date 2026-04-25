import React, { useState, useContext } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

/**
 * Formulario de inicio de sesión. Su función es permitir que el usuario ingrese
 * sus credenciales para autenticarse y acceder a las rutas privadas.
 */
function Login() {
  /**
   * Visibilidad de la contraseña.
   * true: mostrar
   * false: ocultar
   */
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Obtiene la función para cambiar el estado global del login.
   */
  const { setIsLoggedIn } = useContext(AuthContext);

  /**
   * Hook para navegar a otra ruta después del login.
   */
  const navigate = useNavigate();

  /**
   * Si las credenciales son correctas, activa el login y redirige.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    /* Usuario de prueba para la primera fase. */
    if (email === 'admin@gmail.com' && password === '1234') {
      setIsLoggedIn(true);
      navigate('/juegos');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <>
      {/* Contenedor principal del formulario centrado y con margen superior. */}
      <div className="container mt-5 d-flex justify-content-center">
        
        {/* Card del formulario con padding interno y ancho adaptable. */}
        <Card className="form-card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <Card.Body>
            
            {/* Título principal del formulario centrado y con margen inferior. */}
            <h2 className="text-center mb-4" style={{ color: 'var(--gold-main)' }}>
              Iniciar Sesión
            </h2>

            {/* Form agrupa todos los campos del formulario. */}
            <Form onSubmit={handleSubmit}>
              
              {/* Campo de correo electrónico. */} 
              <Form.Group className="mb-3"> 
                <Form.Label>Correo Electrónico</Form.Label> 
                
                {/* Input de tipo email con texto guía. */} 
                <Form.Control name="email" type="email" placeholder="Ingresa tu email" /> 
              </Form.Group>

              {/* Campo de contraseña. */}
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>

                {/* Agrupa el input y el botón para mostrar u ocultar la contraseña. */}
                <InputGroup>
                  
                  {/* Si showPassword es true se muestra el texto; si no, se oculta. */}
                  <Form.Control
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                  />

                  <InputGroup.Text>
                    
                    {/* Botón para alternar la visibilidad de la contraseña. */}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: 0, border: 'none', background: 'none' }}
                    >
                      {/* 🙈 cuando está visible, 👁️ cuando está oculta. */}
                      {showPassword ? '🙈' : '👁️'}
                    </Button>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* Botón para enviar el formulario ocupando todo el ancho. */}
              <Button variant="warning" type="submit" className="w-100">
                Iniciar Sesión
              </Button>

              {/* Botón para volver a la página de inicio. */}
              <Button as={Link} to="/" variant="dark" className="w-100 mt-3">
                Volver al inicio
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Login;