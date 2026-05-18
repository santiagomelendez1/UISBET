import { useContext, useEffect, useState } from 'react';
import { Container, Card, Button, Form, Table } from 'react-bootstrap';
import NavbarCasino from '../components/NavbarCasino';
import FooterCasino from '../components/FooterCasino';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../services/api';

/* CRUD de compras. */
function AdminCompras() {
  /* Obtiene el token de la sesión actual. */
  const { token } = useContext(AuthContext);

  /* Estados de la sección. */
  const [purchases, setPurchases] = useState([]);
  const [packages, setPackages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    package_id: '',
    payment_reference: '',
    status: 'pagada',
  });

  /* Carga compras y paquetes desde el backend. */
  const loadData = async () => {
    const purchasesData = await apiRequest('/purchases', {}, token);
    const packageData = await apiRequest('/packages');
    setPurchases(purchasesData);
    setPackages(packageData);
  };

  /* Carga la información al abrir la página. */
  useEffect(() => {
    loadData();
  }, [token]);

  /* Actualiza el estado del formulario al escribir o seleccionar valores. */
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* Envía la actualización de la compra al backend. */
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

    /* Limpia el modo edición y recarga la tabla. */
    setEditingId(null);
    setFormData({ package_id: '', payment_reference: '', status: 'pagada' });
    loadData();
  };

  /* Carga en el formulario la compra seleccionada para editar. */
  const handleEdit = (purchase) => {
    setEditingId(purchase.id);
    setFormData({
      package_id: String(purchase.package_id),
      payment_reference: purchase.payment_reference || '',
      status: purchase.status,
    });
  };

  /* Elimina una compra según su id. */
  const handleDelete = async (id) => {
    await apiRequest(`/purchases/${id}`, { method: 'DELETE' }, token);
    loadData();
  };

  return (
    <>
      {/* Barra de navegación superior. */}
      <NavbarCasino />

      {/* Sección principal del mantenimiento de compras. */}
      <section className="section-dark py-5" style={{ marginTop: '90px', minHeight: '100vh' }}>
        <Container>
          
          {/* Título principal de la sección. */}
          <div className="section-title mb-4">
            <span>CRUD</span>
            <h2>Mantenimiento de compras</h2>
          </div>

          {/* Formulario de edición visible solo si hay una compra seleccionada. */}
          {editingId && (
            <Card className="feature-card p-4 mb-4">
              <Form onSubmit={handleSubmit}>
                
                {/* Selector del paquete asociado a la compra. */}
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

                {/* Campo para editar la referencia de pago. */}
                <Form.Group className="mb-3">
                  <Form.Label>Referencia</Form.Label>
                  <Form.Control
                    name="payment_reference"
                    value={formData.payment_reference}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Selector del estado actual de la compra. */}
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleChange}>
                    <option value="pendiente">pendiente</option>
                    <option value="pagada">pagada</option>
                    <option value="cancelada">cancelada</option>
                  </Form.Select>
                </Form.Group>

                {/* Botón para guardar la actualización de la compra. */}
                <Button type="submit" variant="warning">
                  Actualizar compra
                </Button>
              </Form>
            </Card>
          )}

          {/* Card que contiene la tabla de compras registradas. */}
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
                {/* Recorre las compras y crea una fila por cada una. */}
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.id}</td>
                    <td>{purchase.user_name}</td>
                    <td>{purchase.email}</td>
                    <td>{purchase.package_name}</td>
                    <td>{purchase.status}</td>
                    
                    {/* Botones para editar o eliminar la compra. */}
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

      {/* Pie de página del sitio. */}
      <FooterCasino />
    </>
  );
}

export default AdminCompras;