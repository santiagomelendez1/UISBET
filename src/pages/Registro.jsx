import React, { useState } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

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

            {/* Form agrupa todos los campos del formulario. */}
            <Form>
              
              {/* Campo para ingresar el nombre del usuario. */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" placeholder="Ingresa tu nombre" />
              </Form.Group>

              {/* Campo para ingresar el correo electrónico. */}
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
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

              {/* Campo para confirmar la contraseña. */}
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>

                {/* Agrupa el input y el botón para mostrar u ocultar la confirmación. */}
                <InputGroup>
                  
                  {/* Si showConfirmPassword es true se muestra el texto; si no, se oculta. */}
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                  />

                  <InputGroup.Text>
                    
                    {/* Botón para alternar la visibilidad de la confirmación. */}
                    <Button
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
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Registro;