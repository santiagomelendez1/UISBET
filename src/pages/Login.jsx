import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

/**
 * Formulario de inicio de sesión. Su función es permitir que el usuario ingrese
 * su correo electrónico y contraseña para autenticarse.
 */
function Login() {
  /**
   * Visibilidad de la contraseña.
   * true: mostrar
   * false: ocultar
   */
  const [showPassword, setShowPassword] = useState(false);

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
            <Form>
              
              {/* Campo de correo electrónico. */}
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>

                {/* Input de tipo email con texto guía. */}
                <Form.Control type="email" placeholder="Ingresa tu email" />
              </Form.Group>

              {/* Campo de contraseña. */}
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>

                {/* Agrupa el input y el botón para mostrar u ocultar la contraseña. */}
                <InputGroup>
                  
                  {/* Si showPassword es true se muestra el texto; si no, se oculta. */}
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                  />

                  <InputGroup.Text>
                    
                    {/* Botón para alternar la visibilidad de la contraseña. */}
                    <Button
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
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Login;