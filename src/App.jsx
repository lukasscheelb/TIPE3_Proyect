import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import {
  createProperty,
  fetchProperties,
  updateProperty,
} from './services/propertiesApi';

const PAGE_TITLES = {
  '/': 'Organizador de Propiedades',
  '/propiedades': 'Listado de Propiedades',
  '/agregar': 'Agregar Propiedad',
  '/editar': 'Editar Propiedad',
};

function App() {
  const [theme, setTheme] = useState('light');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);
      setError('');
      setProperties(await fetchProperties());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProperty(payload) {
    const created = await createProperty(payload);
    setProperties((current) => [...current, created]);
    return created;
  }

  async function handleUpdateProperty(propertyId, payload) {
    const updated = await updateProperty(propertyId, payload);
    setProperties((current) =>
      current.map((item) => (item.id === propertyId ? updated : item))
    );
    return updated;
  }

  const contentState = { properties, loading, error };

  const renderShell = (title, content) => (
    <div className="app-layout">
      <BottomNavigation />
      <div className="app-main">
      <Header
        title={title}
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === 'light' ? 'dark' : 'light'))
        }
      />
      <main className="screen-content">{content}</main>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="mobile-frame desktop-frame">
        <Routes>
          <Route
            path="/"
            element={renderShell(PAGE_TITLES['/'], <HomePage {...contentState} />)}
          />
          <Route
            path="/propiedades"
            element={renderShell(
              PAGE_TITLES['/propiedades'],
              <PropertiesPage {...contentState} />
            )}
          />
          <Route
            path="/propiedad/:id"
            element={renderShell(
              'Detalle de Propiedad',
              <PropertyDetailPage {...contentState} />
            )}
          />
          <Route
            path="/agregar"
            element={renderShell(
              PAGE_TITLES['/agregar'],
              <AddPropertyPage onCreateProperty={handleCreateProperty} />
            )}
          />
          <Route
            path="/editar/:id"
            element={renderShell(
              PAGE_TITLES['/editar'],
              <EditPropertyPage
                properties={properties}
                loading={loading}
                error={error}
                onUpdateProperty={handleUpdateProperty}
              />
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
