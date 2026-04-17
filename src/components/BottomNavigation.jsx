import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/agregar', label: 'Agregar' },
];

function BottomNavigation() {
  return (
    <aside className="bottom-nav">
      <div className="sidebar-brand">
        <span className="sidebar-brand__eyebrow">Panel</span>
        <strong>Gestión de Propiedades</strong>
      </div>

      <nav className="bottom-nav__inner">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'bottom-nav__link bottom-nav__link--active' : 'bottom-nav__link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default BottomNavigation;
