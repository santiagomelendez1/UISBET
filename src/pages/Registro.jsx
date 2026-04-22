import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

function Registro() {
  // Estados para controlar la visibilidad de las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <Card className="form-card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: 'var(--gold-main)' }}>Registro</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingresa tu nombre" />
            </Form.Group>
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
            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              {/* InputGroup para agregar el botón de toggle junto al campo de confirmación */}
              <InputGroup>
                <Form.Control type={showConfirmPassword ? "text" : "password"} placeholder="Confirma tu contraseña" />
                <InputGroup.Text>
                  {/* Botón para alternar visibilidad, con ícono común */}
                  <Button variant="link" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 0, border: 'none', background: 'none' }}>
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Button variant="warning" type="submit" className="w-100">
              Registrarse
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Registro;