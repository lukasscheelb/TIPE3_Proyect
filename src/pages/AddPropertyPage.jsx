import { useNavigate } from 'react-router-dom';
import PropertyForm from '../components/PropertyForm';

function AddPropertyPage({ onCreateProperty }) {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    const created = await onCreateProperty(payload);
    navigate(`/propiedad/${created.id}`);
  }

  return (
    <section className="content-stack">
      <div className="intro-card">
        <p className="section-heading__eyebrow">Registro</p>
        <h2>Nueva propiedad</h2>
        <p>Completa el formulario para crear un nuevo registro de propiedad en la plataforma.</p>
      </div>
      <PropertyForm mode="create" onSubmit={handleCreate} />
    </section>
  );
}

export default AddPropertyPage;
