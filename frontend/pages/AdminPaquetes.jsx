import { useContext, useEffect, useState } from 'react';
import { Container, Card, Button, Form, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/* CRUD de paquetes. */
function AdminPaquetes() {
  /* Obtiene el token de la sesión actual. */
  const { token } = useContext(AuthContext);

  /* Estados de la sección. */
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    chips: '',
    price: '',
    description: '',
  });

  /* Carga los paquetes desde el backend. */
  const loadPackages = async () => {
    const data = await apiRequest('/packages');
    setPackages(data);
  };

  /* Carga los paquetes al abrir la página. */
  useEffect(() => {
    loadPackages();
  }, []);

  /* Actualiza el estado del formulario al escribir. */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Crea o actualiza un paquete según el modo actual. */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await apiRequest(
        `/packages/${editingId}`,
        {
          method: 'PUT',
          body: JSON.stringify(formData),
        },
        token
      );
    } else {
      await apiRequest(
        '/packages',
        {
          method: 'POST',
          body: JSON.stringify(formData),
        },
        token
      );
    }

    /* Limpia el formulario y recarga la tabla. */
    setEditingId(null);
    setFormData({ name: '', chips: '', price: '', description: '' });
    loadPackages();
  };

  /* Carga un paquete en el formulario para editarlo. */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      chips: item.chips,
      price: item.price,
      description: item.description || '',
    });
  };

  /* Elimina un paquete por id. */
  const handleDelete = async (id) => {
    await apiRequest(`/packages/${id}`, { method: 'DELETE' }, token);
    loadPackages();
  };

  return (
    <>
      {/* Barra de navegación superior. */}
      <NavbarCasino />

      {/* Sección principal de mantenimiento de paquetes. */}
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          
          {/* Título principal de la sección. */}
          <div className="section-title mb-4">
            <span>CRUD</span>
            <h2>Mantenimiento de paquetes</h2>
          </div>

          {/* Card con el formulario para crear o editar paquetes. */}
          <Card className="feature-card p-4 mb-4">
            <Form onSubmit={handleSubmit}>
              
              {/* Campo del nombre del paquete. */}
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>

              {/* Campo de cantidad de fichas. */}
              <Form.Group className="mb-3">
                <Form.Label>Fichas</Form.Label>
                <Form.Control name="chips" type="number" value={formData.chips} onChange={handleChange} required />
              </Form.Group>

              {/* Campo del precio del paquete. */}
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control name="price" type="number" value={formData.price} onChange={handleChange} required />
              </Form.Group>

              {/* Campo de la descripción del paquete. */}
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control name="description" value={formData.description} onChange={handleChange} />
              </Form.Group>

              {/* Botón para crear o actualizar el paquete. */}
              <Button type="submit" variant="warning">
                {editingId ? 'Actualizar' : 'Crear'} paquete
              </Button>
            </Form>
          </Card>

          {/* Card con la tabla de paquetes registrados. */}
          <Card className="feature-card p-4">
            <Table responsive striped bordered variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Fichas</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {/* Recorre los paquetes y crea una fila por cada uno. */}
                {packages.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.chips}</td>
                    <td>{item.price}</td>
                    <td className="d-flex gap-2 flex-wrap">
                      
                      {/* Botón para cargar el paquete en modo edición. */}
                      <Button size="sm" variant="outline-warning" onClick={() => handleEdit(item)}>
                        Editar
                      </Button>

                      {/* Botón para eliminar el paquete. */}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </section>

      {/* Pie de página del sitio. */}
      <FooterCasino />
    </>
  );
}

export default AdminPaquetes;