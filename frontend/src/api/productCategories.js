const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BACKEND_URL = BASE_URL.split('/api/v1')[0];

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

const normalizeCategory = (c) => ({
  ...c,
  image: getImageUrl(c.image)
});

export async function fetchProductCategories() {
  const response = await fetch(`${BASE_URL}/collections`);
  if (!response.ok) throw new Error('Failed to fetch collections');
  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeCategory) : [];
}

export async function fetchCollectionByIdOrSlug(idOrSlug) {
  const response = await fetch(`${BASE_URL}/collections/${idOrSlug}`);
  if (!response.ok) throw new Error('Failed to fetch collection');
  const data = await response.json();
  return normalizeCategory(data);
}

