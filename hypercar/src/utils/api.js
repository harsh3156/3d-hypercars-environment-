export function buildApiUrl(path = '/') {
  const configuredBase = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!configuredBase) {
    return normalizedPath;
  }

  return `${configuredBase}${normalizedPath}`;
}

export async function fetchCars() {
  const response = await fetch(buildApiUrl('/api/cars'));

  if (!response.ok) {
    throw new Error('Unable to load hypercar inventory from the backend');
  }

  const payload = await response.json();
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function fetchPriceSummary(carId, selectedOptions = {}) {
  const response = await fetch(buildApiUrl('/api/configurations/price-summary'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carId, selectedOptions }),
  });

  if (!response.ok) {
    throw new Error('Unable to calculate the live configurator estimate');
  }

  const payload = await response.json();
  return payload?.data || null;
}
