import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatMillionsCLP } from '../utils/formatters';

const splitTasks = (value) =>
  Array.isArray(value) ? value : String(value || '').split('\n').filter(Boolean);

function Field({ label, value }) {
  return (
    <div className="detail-field">
      <span>{label}</span>
      <strong>{value || 'Sin registrar'}</strong>
    </div>
  );
}

function PropertyDetailPage({ properties, loading, error }) {
  const { id } = useParams();
  const property = properties.find((item) => item.id === Number(id));
  const images = useMemo(() => {
    if (!property) return [];
    if (Array.isArray(property.imagenes) && property.imagenes.length > 0) return property.imagenes;
    return property.imagen ? [property.imagen] : [];
  }, [property]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFichaImage, setSelectedFichaImage] = useState('');
  const [fichaZoomed, setFichaZoomed] = useState(false);

  const openFichaModal = (image) => {
    setSelectedFichaImage(image);
    setFichaZoomed(false);
  };

  const closeFichaModal = () => {
    setSelectedFichaImage('');
    setFichaZoomed(false);
  };

  useEffect(() => {
    setActiveImageIndex(0);
    closeFichaModal();
  }, [property?.id]);

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
        <Link to="/" className="primary-button">
          Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-gallery">
        {images.length > 0 ? (
          <>
            <img
              src={images[activeImageIndex]}
              alt={`${property.titulo || 'Propiedad'} ${activeImageIndex + 1}`}
              className="detail-hero"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-nav gallery-nav--prev"
                  onClick={() => setActiveImageIndex((current) => (current - 1 + images.length) % images.length)}
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="gallery-nav gallery-nav--next"
                  onClick={() => setActiveImageIndex((current) => (current + 1) % images.length)}
                >
                  Siguiente
                </button>
              </>
            )}
            {images.length > 1 && (
              <div className="gallery-strip">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`gallery-thumb ${index === activeImageIndex ? 'gallery-thumb--active' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${property.titulo || 'Propiedad'} miniatura ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>Sin fotografías de la propiedad</h2>
            <p>Agrega imágenes desde la edición de la ficha.</p>
          </div>
        )}
      </div>

      <div className="detail-card detail-section">
        <p className="detail-chip">Información principal</p>
        <h2>{property.titulo || 'Propiedad sin título'}</h2>
        <div className="detail-grid">
          <Field label="Dueño/a" value={property.dueno} />
          <Field label="Teléfono" value={property.telefono} />
          <Field label="Ciudad" value={property.ciudad} />
          <Field label="Tipo de propiedad" value={property.tipo} />
          <Field label="Precio en CLP" value={formatMillionsCLP(property.precio)} />
          <Field label="UF" value={property.uf} />
        </div>
      </div>

      {property.fichaImagen && (
        <div className="detail-card detail-section">
          <p className="detail-chip">Fotografía de ficha</p>
          <div className="sheet-preview-card">
            <div className="sheet-preview-card__header">
              <div>
                <span>Ficha física adjunta</span>
                <strong>Vista de respaldo para lectura de datos</strong>
              </div>
              <button
                type="button"
                className="secondary-button secondary-button--small"
                onClick={() => openFichaModal(property.fichaImagen)}
              >
                Ver grande
              </button>
            </div>
            <button
              type="button"
              className="sheet-preview-button"
              onClick={() => openFichaModal(property.fichaImagen)}
            >
              <img src={property.fichaImagen} alt="Fotografía de ficha física" className="sheet-preview-image" />
            </button>
          </div>
        </div>
      )}

      <div className="detail-card detail-section">
        <p className="detail-chip">Costos de venta</p>
        <div className="cost-list">
          {[
            ['Publicidad', property.costosPublicidad],
            ['Fotografía', property.costosFotografia],
            ['Material publicitario', property.materialPublicitario],
            ['Otros gastos', property.otrosGastos],
            ['Costo total estimado', property.costoTotalEstimado],
          ].map(([label, value]) => (
            <label key={label} className="cost-item">
              <span>{label}</span>
              <input type="text" value={value || 'Sin registrar'} readOnly />
            </label>
          ))}
        </div>
      </div>

      <div className="detail-card detail-section">
        <p className="detail-chip">Trámites realizados y pendientes</p>
        <div className="task-columns">
          <div className="task-group">
            <h3>Trámites realizados</h3>
            <div className="task-list">
              {splitTasks(property.tramitesRealizados).length > 0 ? (
                splitTasks(property.tramitesRealizados).map((task) => (
                  <div key={task} className="task-item task-item--done">
                    <span className="task-marker">OK</span>
                    <span>{task}</span>
                  </div>
                ))
              ) : (
                <p className="helper-copy">Sin trámites realizados registrados.</p>
              )}
            </div>
          </div>

          <div className="task-group">
            <h3>Trámites pendientes</h3>
            <div className="task-list">
              {splitTasks(property.tramitesPendientes).length > 0 ? (
                splitTasks(property.tramitesPendientes).map((task) => (
                  <div key={task} className="task-item">
                    <span className="task-marker">...</span>
                    <span>{task}</span>
                  </div>
                ))
              ) : (
                <p className="helper-copy">Sin trámites pendientes registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-card detail-section">
        <p className="detail-chip">Notas adicionales</p>
        <div className="detail-note">
          <span>Condiciones de venta</span>
          <p className="detail-description">{property.condicionesVenta || 'Sin registrar'}</p>
        </div>
        <div className="detail-grid">
          <Field
            label="Honorarios de corretaje (%)"
            value={property.honorariosCorretaje ? `${property.honorariosCorretaje}%` : ''}
          />
        </div>
        <div className="detail-note">
          <span>Notas</span>
          <p className="detail-description">{property.notas || 'Sin registrar'}</p>
        </div>
        <div className="detail-actions detail-actions--row">
          <Link to={`/editar/${property.id}`} className="primary-button">
            Editar propiedad
          </Link>
          <Link to="/propiedades" className="secondary-button">
            Volver
          </Link>
        </div>
      </div>

      {selectedFichaImage && (
        <div className="image-modal" role="dialog" aria-modal="true" aria-label="Fotografía de ficha ampliada">
          <button type="button" className="image-modal__backdrop" onClick={closeFichaModal}>
            Cerrar vista ampliada
          </button>
          <div className="image-modal__content">
            <div className="image-modal__toolbar">
              <button
                type="button"
                className="secondary-button secondary-button--small"
                onClick={() => setFichaZoomed((current) => !current)}
              >
                {fichaZoomed ? 'Ajustar a pantalla' : 'Activar lupa'}
              </button>
              <button type="button" className="image-modal__close" onClick={closeFichaModal}>
                Cerrar
              </button>
            </div>
            <div className={`image-modal__scroll ${fichaZoomed ? 'image-modal__scroll--zoomed' : ''}`}>
              <img src={selectedFichaImage} alt="Fotografía de ficha ampliada" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PropertyDetailPage;
