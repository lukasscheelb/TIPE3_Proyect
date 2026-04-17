import { Link, useNavigate } from 'react-router-dom';
import { formatMillionsCLP } from '../utils/formatters';

function PropertyCard({ property, compact = false, showDetailsButton = false }) {
  const navigate = useNavigate();
  const coverImage = Array.isArray(property.imagenes) && property.imagenes.length > 0
    ? property.imagenes[0]
    : property.imagen;
  const cityLabel = property.ciudad || 'Sin ciudad registrada';
  const communeLabel = property.comuna || 'Sin comuna';
  const typeLabel = property.tipo || 'Sin tipo';

  return (
    <article
      className={`property-card ${compact ? 'property-card--compact' : ''}`}
      onClick={() => navigate(`/propiedad/${property.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate(`/propiedad/${property.id}`);
        }
      }}
    >
      <div className="property-card__link">
        <img src={coverImage} alt={property.titulo} className="property-card__image" />

        <div className="property-card__body">
          <div className="property-card__topline">
            <span className="property-card__city">{cityLabel}</span>
            <span className="property-card__city-separator">/</span>
            <span className="property-card__city">{communeLabel}</span>
          </div>
          <h3>{property.titulo}</h3>
          <p className="property-card__price">{formatMillionsCLP(property.precio)}</p>
          <div className="property-card__footer">
            <span className="property-card__meta">{typeLabel}</span>
            <div className="property-card__actions">
              {showDetailsButton && (
                <Link
                  to={`/propiedad/${property.id}`}
                  className="details-link details-link--button"
                  onClick={(event) => event.stopPropagation()}
                >
                  Ver detalles
                </Link>
              )}
              <Link
                to={`/editar/${property.id}`}
                className="secondary-button secondary-button--small"
                onClick={(event) => event.stopPropagation()}
              >
                Editar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
