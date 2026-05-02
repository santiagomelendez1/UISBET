import React, { useState, useContext } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
  //---------------------MOdificacion, conexion backend-------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Obtiene los valores de email y contraseña del formulario.
    const email = e.target.email.value;
    const password = e.target.password.value;
    // se hace una validacion "try / catch"para asegurarse de que la conexion no falle
    try {
      // Enviar datos al backend (ajusta la URL según tu puerto de Express)
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST", // Método POST para enviar datos
        headers: {
          // le decimos al backend que el contenido de la informacion es un JSON
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // convierte el email y password a formato JSON para enviarlo al backend
      });
      // cunado el servido responda, se convierte la respuesta a formato JSON para poder leer el mensaje que envia el backend
      const data = await response.json();

      if (response.ok) {
        //Si el login es exitoso en el backend
        setIsLoggedIn(true);
        // Opcional: Guardar token si usas JWT más adelante
        // localStorage.setItem('token', data.token);
        navigate("/juegos"); // Redirige a la página de juegos después del login exitoso
      } else {
        // 3. Si el backend dice que las credenciales no coinciden
        alert(data.message || "Credenciales incorrectas");
      }
      //Si hay un error en la conexión o en el proceso de login
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    }
    //--------------------------------------------------------------------------
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
                Iniciar Sesión
              </h2>

              {/* Form agrupa todos los campos del formulario. */}
              <Form onSubmit={handleSubmit}>
                {/* Campo de correo electrónico. */}
                <Form.Group className="mb-3">
                  <Form.Label>Correo Electrónico</Form.Label>

                  {/* Input de tipo email con texto guía. */}
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Ingresa tu email"
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                    />

                    <InputGroup.Text>
                      {/* Botón para alternar la visibilidad de la contraseña. */}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          padding: 0,
                          border: "none",
                          background: "none",
                        }}
                      >
                        {/* 🙈 cuando está visible, 👁️ cuando está oculta. */}
                        {showPassword ? "🙈" : "👁️"}
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

                {/* Enlace al formulario de registro. */}
                <p className="text-start mt-3 mb-0">
                  <Link
                    to="/registro"
                    style={{
                      textDecoration: "underline",
                      color: "var(--gold-main)",
                    }}
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  };
}
export default Login;
