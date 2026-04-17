const API_BASE = 'http://127.0.0.1:8000/api/properties';

async function handleResponse(response) {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Request failed');
  }

  return response.json();
}

export async function fetchProperties() {
  return handleResponse(await fetch(API_BASE));
}

export async function fetchProperty(id) {
  return handleResponse(await fetch(`${API_BASE}/${id}`));
}

export async function createProperty(payload) {
  return handleResponse(
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );
}

export async function updateProperty(id, payload) {
  return handleResponse(
    await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );
}
