function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon">Buscar</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchBar;
