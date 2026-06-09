import { buildApiUrl } from './api';

describe('buildApiUrl', () => {
  const originalApiUrl = process.env.REACT_APP_API_URL;

  afterEach(() => {
    process.env.REACT_APP_API_URL = originalApiUrl;
  });

  it('returns a relative path when no backend URL is configured', () => {
    delete process.env.REACT_APP_API_URL;
    expect(buildApiUrl('/api/cars')).toBe('/api/cars');
  });

  it('prepends the configured backend URL when available', () => {
    process.env.REACT_APP_API_URL = 'http://localhost:5000';
    expect(buildApiUrl('/api/cars')).toBe('http://localhost:5000/api/cars');
  });
});
