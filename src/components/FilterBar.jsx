function FilterBar({
  city,
  onCityChange,
  type,
  onTypeChange,
  maxPrice,
  onMaxPriceChange,
  cities,
  types,
}) {
  return (
    <section className="filter-bar">
      <select value={city} onChange={(event) => onCityChange(event.target.value)}>
        <option value="">Todas las ciudades</option>
        {cities.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select value={type} onChange={(event) => onTypeChange(event.target.value)}>
        <option value="">Todos los tipos</option>
        {types.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <label className="price-filter">
        <span>Hasta {`${Number(maxPrice / 1000).toLocaleString('es-CL')} millones CLP`}</span>
        <input
          type="range"
          min="100000"
          max="600000"
          step="10000"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
        />
      </label>
    </section>
  );
}

export default FilterBar;
