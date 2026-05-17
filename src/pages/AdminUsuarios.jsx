import { useContext, useEffect, useState } from 'react';
import { Container, Card, Button, Form, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/**
 * CRUD de usuarios.
 */
function AdminUsuarios() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const loadUsers = async () => {
    const data = await apiRequest('/users', {}, token);
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await apiRequest(`/users/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      }, token);
    } else {
      await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(formData),
      }, token);
    }

    setEditingId(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    await apiRequest(`/users/${id}`, { method: 'DELETE' }, token);
    loadUsers();
  };

  return (
    <>
      <NavbarCasino />

      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>CRUD</span>
            <h2>Mantenimiento de usuarios</h2>
          </div>

          <Card className="feature-card p-4 mb-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control name="email" type="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              {!editingId && (
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="warning">
                {editingId ? 'Actualizar' : 'Crear'} usuario
              </Button>
            </Form>
          </Card>

          <Card className="feature-card p-4">
            <Table responsive striped bordered variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline-warning" onClick={() => handleEdit(user)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(user.id)}>
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

      <FooterCasino />
    </>
  );
}

export default AdminUsuarios;