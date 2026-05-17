import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

/**
 * Formulario de registro. Su función es permitir que el usuario ingrese
 * sus datos básicos y cree una cuenta.
 */
function Registro() {
  /**
   * Visibilidad de la contraseña principal y la confirmación de contraseña.
   * true: mostrar
   * false: ocultar
   */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* Mensajes del formulario. */
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  /* Envía el registro al backend. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      setMessage('Registro exitoso. Ahora puedes iniciar sesión.');
      e.target.reset();

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      setErrorMessage(error.message);
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
              Registro
            </h2>

            {/* Mensaje de éxito. */}
            {message && <p className="text-success">{message}</p>}

            {/* Mensaje de error. */}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            {/* Form agrupa todos los campos del formulario. */}
            <Form onSubmit={handleSubmit}>
              
              {/* Campo para ingresar el nombre del usuario. */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </Form.Group>

              {/* Campo para ingresar el correo electrónico. */}
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Ingresa tu email"
                  required
                />
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
                    required
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

              {/* Campo para confirmar la contraseña. */}
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>

                {/* Agrupa el input y el botón para mostrar u ocultar la confirmación. */}
                <InputGroup>
                  
                  {/* Si showConfirmPassword es true se muestra el texto; si no, se oculta. */}
                  <Form.Control
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    required
                  />

                  <InputGroup.Text>
                    
                    {/* Botón para alternar la visibilidad de la confirmación. */}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ padding: 0, border: 'none', background: 'none' }}
                    >
                      {/* 🙈 cuando está visible, 👁️ cuando está oculta. */}
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Button>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* Botón para enviar el formulario ocupando todo el ancho. */}
              <Button variant="warning" type="submit" className="w-100">
                Registrarse
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

export default Registro;