import { Link, useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';

function EditPropertyPage({ properties, loading, error, onUpdateProperty }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = properties.find((item) => item.id === Number(id));

  async function handleUpdate(payload) {
    const updated = await onUpdateProperty(Number(id), payload);
    navigate(`/propiedad/${updated.id}`);
  }

  if (loading) {
    return <section className="empty-state"><h2>Cargando propiedad...</h2></section>;
  }

  if (error) {
    return <section className="empty-state"><h2>Error: {error}</h2></section>;
  }

  if (!property) {
    return (
      <section className="empty-state">
        <h2>Propiedad no encontrada</h2>
        <Link to="/propiedades" className="secondary-button">
          Volver al listado
        </Link>
      </section>
    );
  }

  return (
    <section className="content-stack">
      <div className="intro-card">
        <p className="section-heading__eyebrow">Edición</p>
        <h2>Actualizar ficha</h2>
        <p>Los cambios se guardan en el archivo JSON de esta propiedad.</p>
      </div>
      <PropertyForm initialValues={property} mode="edit" onSubmit={handleUpdate} />
    </section>
  );
}

export default EditPropertyPage;
