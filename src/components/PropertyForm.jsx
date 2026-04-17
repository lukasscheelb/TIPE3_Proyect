import { useEffect, useMemo, useState } from 'react';
import { propertyInitialValues, propertyTypeOptions } from '../data/propertyForm';

function normalizeTaskList(value) {
  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePayload(form) {
  const imagenes = Array.isArray(form.imagenes)
    ? form.imagenes.filter(Boolean)
    : form.imagen
      ? [form.imagen]
      : [];

  return {
    ...form,
    imagenes,
    imagen: imagenes[0] || '',
    precio: Number(form.precio) || 0,
    uf: Number(form.uf) || 0,
    tramitesRealizados: normalizeTaskList(form.tramitesRealizados),
    tramitesPendientes: normalizeTaskList(form.tramitesPendientes),
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    reader.readAsDataURL(file);
  });
}

function buildImagePreviews(images = []) {
  return images.filter(Boolean).map((image, index) => ({
    id: `saved-${index}-${image}`,
    src: image,
    persisted: true,
  }));
}

function PropertyForm({ initialValues, mode = 'create', onSubmit }) {
  const mergedInitialValues = useMemo(
    () => ({
      ...propertyInitialValues,
      ...initialValues,
      imagenes: Array.isArray(initialValues?.imagenes)
        ? initialValues.imagenes.filter(Boolean)
        : initialValues?.imagen
          ? [initialValues.imagen]
          : [],
      imageUploads: [],
      fichaImagenUpload: null,
      tramitesRealizados: Array.isArray(initialValues?.tramitesRealizados)
        ? initialValues.tramitesRealizados.join('\n')
        : initialValues?.tramitesRealizados ?? '',
      tramitesPendientes: Array.isArray(initialValues?.tramitesPendientes)
        ? initialValues.tramitesPendientes.join('\n')
        : initialValues?.tramitesPendientes ?? '',
    }),
    [initialValues]
  );

  const [form, setForm] = useState(mergedInitialValues);
  const [imagePreviews, setImagePreviews] = useState(buildImagePreviews(mergedInitialValues.imagenes));
  const [fichaPreview, setFichaPreview] = useState(mergedInitialValues.fichaImagen || '');
  const [selectedFichaImage, setSelectedFichaImage] = useState('');
  const [fichaZoomed, setFichaZoomed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(mergedInitialValues);
    setImagePreviews(buildImagePreviews(mergedInitialValues.imagenes));
    setFichaPreview(mergedInitialValues.fichaImagen || '');
    setSelectedFichaImage('');
    setFichaZoomed(false);
    setSaved(false);
    setError('');
  }, [mergedInitialValues]);

  const updateField = (field, value) => {
    setSaved(false);
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openFichaModal = (image) => {
    setSelectedFichaImage(image);
    setFichaZoomed(false);
  };

  const closeFichaModal = () => {
    setSelectedFichaImage('');
    setFichaZoomed(false);
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: await readFileAsDataUrl(file),
        }))
      );

      setForm((current) => ({
        ...current,
        imageUploads: [...(current.imageUploads || []), ...uploadedFiles],
      }));
      setImagePreviews((current) => [
        ...current,
        ...uploadedFiles.map((file, index) => ({
          id: `new-${Date.now()}-${index}-${file.filename}`,
          src: file.content,
          persisted: false,
        })),
      ]);
      setSaved(false);
      setError('');
      event.target.value = '';
    } catch (fileError) {
      setError(fileError.message);
    }
  };

  const handleFichaChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsDataUrl(file);
      setForm((current) => ({
        ...current,
        fichaImagen: '',
        fichaImagenUpload: {
          filename: file.name,
          content,
        },
      }));
      setFichaPreview(content);
      setSaved(false);
      setError('');
      event.target.value = '';
    } catch (fileError) {
      setError(fileError.message);
    }
  };

  const handleRemoveImage = (previewToRemove) => {
    setSaved(false);
    setError('');
    setImagePreviews((current) => current.filter((preview) => preview.id !== previewToRemove.id));

    if (previewToRemove.persisted) {
      setForm((current) => {
        const imagenes = (current.imagenes || []).filter((image) => image !== previewToRemove.src);
        return {
          ...current,
          imagenes,
          imagen: imagenes[0] || '',
        };
      });
      return;
    }

    setForm((current) => ({
      ...current,
      imageUploads: (current.imageUploads || []).filter((upload) => upload.content !== previewToRemove.src),
    }));
  };

  const handleRemoveFicha = () => {
    setForm((current) => ({
      ...current,
      fichaImagen: '',
      fichaImagenUpload: null,
    }));
    setFichaPreview('');
    closeFichaModal();
    setSaved(false);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await onSubmit(normalizePayload(form));
      setSaved(true);
      if (mode === 'create') {
        setForm(propertyInitialValues);
        setImagePreviews([]);
        setFichaPreview('');
        closeFichaModal();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="property-form" onSubmit={handleSubmit}>
        <details className="form-section" open>
          <summary>Información principal</summary>
          <div className="form-section__body">
            <div className="form-grid form-grid--compact">
              <label>
                <span>Título</span>
                <input value={form.titulo} onChange={(event) => updateField('titulo', event.target.value)} required />
              </label>
              <label>
                <span>Dueño/a</span>
                <input value={form.dueno} onChange={(event) => updateField('dueno', event.target.value)} />
              </label>
              <label>
                <span>Teléfono</span>
                <input value={form.telefono} onChange={(event) => updateField('telefono', event.target.value)} />
              </label>
              <label>
                <span>Ciudad</span>
                <input value={form.ciudad} onChange={(event) => updateField('ciudad', event.target.value)} />
              </label>
              <label>
                <span>Tipo de propiedad</span>
                <select value={form.tipo} onChange={(event) => updateField('tipo', event.target.value)}>
                  <option value="">Seleccionar</option>
                  {propertyTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Precio en CLP</span>
                <input value={form.precio} onChange={(event) => updateField('precio', event.target.value)} required />
              </label>
              <label>
                <span>UF</span>
                <input value={form.uf} onChange={(event) => updateField('uf', event.target.value)} />
              </label>
            </div>
          </div>
        </details>

        <details className="form-section" open>
          <summary>Adjuntar las fotos de esta propiedad</summary>
          <div className="form-section__body">
            <div className="upload-panel">
              <div className="upload-panel__copy">
                <span className="upload-panel__eyebrow">Galería de la propiedad</span>
                <strong>Adjunta las fotos de esta propiedad</strong>
                <p>Puedes seleccionar varias imágenes a la vez. La primera quedará como portada principal.</p>
              </div>
              <label className="file-dropzone">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} />
                <span className="file-dropzone__title">Seleccionar imágenes</span>
                <span className="file-dropzone__hint">JPG, PNG o WEBP. Puedes cargar varias fotos.</span>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-preview-card">
                <span>Vista previa de imágenes</span>
                <div className="image-preview-grid">
                  {imagePreviews.map((image, index) => (
                    <div key={image.id} className="image-preview-tile">
                      <img
                        src={image.src}
                        alt={form.titulo || `Vista previa ${index + 1}`}
                        className="image-preview"
                      />
                      <div className="image-preview-tile__footer">
                        <small>{index === 0 ? 'Portada' : `Foto ${index + 1}`}</small>
                        <button
                          type="button"
                          className="secondary-button secondary-button--small image-preview-remove"
                          onClick={() => handleRemoveImage(image)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>

        <details className="form-section" open>
          <summary>Fotografía de ficha</summary>
          <div className="form-section__body">
            <div className="upload-panel upload-panel--sheet">
              <div className="upload-panel__copy">
                <span className="upload-panel__eyebrow">Ficha en papel</span>
                <strong>Adjunta la fotografía de la ficha física</strong>
                <p>Esta imagen queda guardada como respaldo para leer todos los datos escritos en la ficha original.</p>
              </div>
              <label className="file-dropzone">
                <input type="file" accept="image/*" onChange={handleFichaChange} />
                <span className="file-dropzone__title">Seleccionar fotografía de ficha</span>
                <span className="file-dropzone__hint">Se permite una imagen principal de ficha.</span>
              </label>
            </div>

            {fichaPreview && (
              <div className="sheet-preview-card">
                <div className="sheet-preview-card__header">
                  <div>
                    <span>Vista previa de ficha</span>
                    <strong>Ficha física adjunta</strong>
                  </div>
                  <div className="sheet-preview-card__actions">
                    <button
                      type="button"
                      className="secondary-button secondary-button--small"
                      onClick={() => openFichaModal(fichaPreview)}
                    >
                      Ver grande
                    </button>
                    <button
                      type="button"
                      className="secondary-button secondary-button--small"
                      onClick={handleRemoveFicha}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="sheet-preview-button"
                  onClick={() => openFichaModal(fichaPreview)}
                >
                  <img src={fichaPreview} alt="Fotografía de la ficha física" className="sheet-preview-image" />
                </button>
              </div>
            )}
          </div>
        </details>

        <details className="form-section">
          <summary>Costos de venta</summary>
          <div className="form-section__body">
            <div className="form-grid form-grid--compact">
              <label>
                <span>Publicidad</span>
                <input value={form.costosPublicidad} onChange={(event) => updateField('costosPublicidad', event.target.value)} />
              </label>
              <label>
                <span>Fotografía</span>
                <input value={form.costosFotografia} onChange={(event) => updateField('costosFotografia', event.target.value)} />
              </label>
              <label>
                <span>Material publicitario</span>
                <input value={form.materialPublicitario} onChange={(event) => updateField('materialPublicitario', event.target.value)} />
              </label>
              <label>
                <span>Otros gastos</span>
                <input value={form.otrosGastos} onChange={(event) => updateField('otrosGastos', event.target.value)} />
              </label>
              <label>
                <span>Costo total estimado</span>
                <input value={form.costoTotalEstimado} onChange={(event) => updateField('costoTotalEstimado', event.target.value)} />
              </label>
            </div>
          </div>
        </details>

        <details className="form-section">
          <summary>Trámites y notas</summary>
          <div className="form-section__body">
            <label>
              <span>Trámites realizados</span>
              <textarea rows="4" value={form.tramitesRealizados} onChange={(event) => updateField('tramitesRealizados', event.target.value)} />
            </label>
            <label>
              <span>Trámites pendientes</span>
              <textarea rows="4" value={form.tramitesPendientes} onChange={(event) => updateField('tramitesPendientes', event.target.value)} />
            </label>
            <label>
              <span>Condiciones de venta</span>
              <textarea rows="4" value={form.condicionesVenta} onChange={(event) => updateField('condicionesVenta', event.target.value)} />
            </label>
            <label>
              <span>Honorarios de corretaje (%)</span>
              <input value={form.honorariosCorretaje} onChange={(event) => updateField('honorariosCorretaje', event.target.value)} />
            </label>
            <label>
              <span>Notas adicionales</span>
              <textarea rows="5" value={form.notas} onChange={(event) => updateField('notas', event.target.value)} />
            </label>
          </div>
        </details>

        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Guardar propiedad'}
        </button>
      </form>

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

      {saved && <div className="success-banner">Información guardada correctamente.</div>}
      {error && <div className="error-banner">{error}</div>}
    </>
  );
}

export default PropertyForm;
