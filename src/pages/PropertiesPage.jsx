import { useState } from 'react';
import FilterBar from '../components/FilterBar';
import PropertyCard from '../components/PropertyCard';

function PropertiesPage({ properties, loading, error }) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxPrice, setMaxPrice] = useState(600000);

  const cities = [...new Set(properties.map((property) => property.ciudad).filter(Boolean))];
  const types = [...new Set(properties.map((property) => property.tipo).filter(Boolean))];

  const filteredProperties = properties.filter((property) => {
    const matchesCity = selectedCity ? property.ciudad === selectedCity : true;
    const matchesType = selectedType ? property.tipo === selectedType : true;
    const matchesPrice = property.precio <= Number(maxPrice);
    return matchesCity && matchesType && matchesPrice;
  });

  return (
    <section className="content-stack">
      <FilterBar
        city={selectedCity}
        onCityChange={setSelectedCity}
        type={selectedType}
        onTypeChange={setSelectedType}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        cities={cities}
        types={types}
      />

      {loading && <section className="empty-state"><h2>Cargando propiedades...</h2></section>}
      {error && <section className="empty-state"><h2>Error: {error}</h2></section>}

      {!loading && !error && (
        <>
          <div className="section-heading section-heading--market">
            <div>
              <p className="section-heading__eyebrow">Catálogo</p>
              <h2>Propiedades disponibles</h2>
              <p className="section-heading__description">
                Explora el inventario completo y entra directo a la ficha o edición.
              </p>
            </div>
            <span className="results-pill">{filteredProperties.length} disponibles</span>
          </div>

          <div className="list-stack properties-list">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} compact showDetailsButton />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default PropertiesPage;
