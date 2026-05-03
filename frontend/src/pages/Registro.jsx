import React, { useState } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

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
  const navigate = useNavigate(); // Hook para navegar a otra ruta después del registro.

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Capturamos los valores que el usuario ingresa en el formulario
    //.nombre.value: Busca el input que tiene name="nombre" y extrae lo que el usuario escribió
    const nombre = e.target.nombre.value;
    const email = e.target.correoElectronico.value;
    const password = e.target.contraseña.value;
    const confirmPassword = e.target.confirmarContraseña.value;

    // Validamos que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Enviar datos al backend (ajusta la URL según tu puerto de Express)
    try {
      // Enviar datos al backend (ajusta la URL según el puerto de Express)
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST", // Método POST para enviar datos
        headers: {
          // le decimos al backend que el contenido de la informacion es un JSON
          "Content-Type": "application/json",
        },
        // Convertimos el nombre, email y password a formato JSON para enviarlo al backend
        body: JSON.stringify({ nombre, email, password }),
      });
      // Cuando el servidor responda, se convierte la respuesta a formato JSON para poder leer el mensaje que envia el backend
      const data = await response.json();

      if (response.ok) {
        // Si el registro es exitoso
        alert("Registro exitoso");
        navigate("/login"); // Redirige a la página de login después del registro exitoso
      } else {
        // Si el backend dice que el usuario ya existe o hay otro error
        alert(data.message || "Error al registrar usuario");
      }
    } catch (error) {
      // Si hay un error en la conexión o en el proceso de registro
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar usuario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <>
      {/* Contenedor principal del formulario centrado y con margen superior. */}
      <div className="container mt-5 d-flex justify-content-center">
        {/* Card del formulario con padding interno y ancho adaptable. */}
        <Card
          className="form-card p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Body>
            {/* Título principal del formulario centrado y con margen inferior. */}
            <h2
              className="text-center mb-4"
              style={{ color: "var(--gold-main)" }}
            >
              Registro
            </h2>

            {/* Form agrupa todos los campos del formulario. */}
            <Form onSubmit={handleSubmit}>
              {/* Campo para ingresar el nombre del usuario. */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  required
                />
              </Form.Group>
              {/* Campo para ingresar el correo electrónico. */}
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  name="correoElectronico"
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
                    name="contraseña" // Identificador
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    required
                  />

                  <InputGroup.Text>
                    {/* Botón para alternar la visibilidad de la contraseña. */}
                    <Button
                      variant="link"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ padding: 0, border: "none", background: "none" }}
                    >
                      {/* 🙈 cuando está visible, 👁️ cuando está oculta. */}
                      {showPassword ? "🙈" : "👁️"}
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
                    name="confirmarContraseña" // Identificador
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    required
                  />

                  <InputGroup.Text>
                    {/* Botón para alternar la visibilidad de la confirmación. */}
                    <Button
                      variant="link"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ padding: 0, border: "none", background: "none" }}
                    >
                      {/* 🙈 cuando está visible, 👁️ cuando está oculta. */}
                      {showConfirmPassword ? "🙈" : "👁️"}
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
