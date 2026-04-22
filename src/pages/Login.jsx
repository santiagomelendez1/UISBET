import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

function Login() {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="form-card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: 'var(--gold-main)' }}>Iniciar Sesión</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control type="email" placeholder="Ingresa tu email" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>

              {/* InputGroup para agregar el botón de toggle junto al campo de contraseña */}
              <InputGroup>
                <Form.Control type={showPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" />
                <InputGroup.Text>

                  {/* Botón para alternar visibilidad, con ícono común */}
                  <Button variant="link" onClick={() => setShowPassword(!showPassword)} style={{ padding: 0, border: 'none', background: 'none' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
              
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;