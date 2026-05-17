import { useContext, useEffect, useState } from 'react';
import { Container, Card, Button, Form, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/**
 * CRUD de compras.
 */
function AdminCompras() {
  const { token } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    package_id: '',
    payment_reference: '',
    status: 'pagada',
  });

  const loadData = async () => {
    const purchasesData = await apiRequest('/purchases', {}, token);
    const packageData = await apiRequest('/packages');
    setPurchases(purchasesData);
    setPackages(packageData);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiRequest(
      `/purchases/${editingId}`,
      {
        method: 'PUT',
        body: JSON.stringify(formData),
      },
      token
    );

    setEditingId(null);
    setFormData({ package_id: '', payment_reference: '', status: 'pagada' });
    loadData();
  };

  const handleEdit = (purchase) => {
    setEditingId(purchase.id);
    setFormData({
      package_id: String(purchase.package_id),
      payment_reference: purchase.payment_reference || '',
      status: purchase.status,
    });
  };

  const handleDelete = async (id) => {
    await apiRequest(`/purchases/${id}`, { method: 'DELETE' }, token);
    loadData();
  };

  return (
    <>
      <NavbarCasino />

      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          <div className="section-title mb-4">
            <span>CRUD</span>
            <h2>Mantenimiento de compras</h2>
          </div>

          {editingId && (
            <Card className="feature-card p-4 mb-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Paquete</Form.Label>
                  <Form.Select name="package_id" value={formData.package_id} onChange={handleChange}>
                    {packages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Referencia</Form.Label>
                  <Form.Control
                    name="payment_reference"
                    value={formData.payment_reference}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="pendiente">pendiente</option>
                    <option value="pagada">pagada</option>
                    <option value="cancelada">cancelada</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="warning">
                  Actualizar compra
                </Button>
              </Form>
            </Card>
          )}

          <Card className="feature-card p-4">
            <Table responsive striped bordered variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Paquete</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.id}</td>
                    <td>{purchase.user_name}</td>
                    <td>{purchase.email}</td>
                    <td>{purchase.package_name}</td>
                    <td>{purchase.status}</td>
                    <td className="d-flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline-warning" onClick={() => handleEdit(purchase)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(purchase.id)}>
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

export default AdminCompras;