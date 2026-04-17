import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';

function HomePage({ properties, loading, error }) {
  const [query, setQuery] = useState('');

  const filteredProperties = properties
    .filter((property) => {
      const searchValue = `${property.titulo} ${property.ciudad} ${property.tipo} ${property.precio}`.toLowerCase();
      return searchValue.includes(query.toLowerCase());
    })
    .slice(0, 6);

  const totalProperties = properties.length;
  const totalCities = new Set(properties.map((property) => property.ciudad)).size;
  const totalForSale = properties.reduce((sum, property) => sum + property.precio, 0);

  return (
    <section className="content-stack">
      <div className="hero-card">
        <div className="hero-card__content">
          <p className="section-heading__eyebrow">Escritorio</p>
          <h2>Panel general de propiedades</h2>
          <p>Administra tu cartera, revisa información comercial y mantén el inventario guardado en archivos JSON del proyecto.</p>
          <div className="hero-card__search">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Buscar por ciudad, precio o tipo de propiedad..."
            />
          </div>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span>Total propiedades</span>
            <strong>{totalProperties}</strong>
          </article>
          <article className="stat-card">
            <span>Ciudades activas</span>
            <strong>{totalCities}</strong>
          </article>
          <article className="stat-card">
            <span>Valor referencial</span>
            <strong>${totalForSale.toLocaleString('es-CL')} MM</strong>
          </article>
        </div>
      </div>

      {loading && <section className="empty-state"><h2>Cargando propiedades...</h2></section>}
      {error && <section className="empty-state"><h2>Error: {error}</h2></section>}

      {!loading && !error && (
        <>
          <div className="section-heading">
            <div>
              <p className="section-heading__eyebrow">Resumen</p>
              <h2>Propiedades destacadas</h2>
            </div>
            <span className="results-pill">{filteredProperties.length} resultados</span>
          </div>

          <div className="property-grid desktop-grid">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} showDetailsButton />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HomePage;
