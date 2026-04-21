const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BACKEND_URL = BASE_URL.split('/api/v1')[0];

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

const normalizeProduct = (p) => ({
  ...p,
  id: p.slug || p._id,
  price: p.sellingPrice,
  oldPrice: p.mrp,
  img: getImageUrl(p.image),
  category: p.collection?.name || '',
  categoryId: p.collection?._id || p.collection || ''
});

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.collection) params.append('collection', filters.collection);
  if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);

  const response = await fetch(`${BASE_URL}/products?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeProduct) : [];
}

export async function fetchProductByIdOrSlug(idOrSlug) {
  const response = await fetch(`${BASE_URL}/products/${idOrSlug}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  const data = await response.json();
  return normalizeProduct(data);
}
