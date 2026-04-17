function Header({ title, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <p className="eyebrow">Gestión inmobiliaria</p>
        <h1>{title}</h1>
        <p className="app-header__subtitle">
          Plataforma local para registrar, revisar y actualizar propiedades.
        </p>
      </div>
      <button className="theme-toggle" type="button" onClick={onToggleTheme}>
        {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      </button>
    </header>
  );
}

export default Header;
