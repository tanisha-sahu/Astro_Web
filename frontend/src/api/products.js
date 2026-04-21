import axiosInstance, { IMAGE_BASE_URL } from './axiosInstance';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
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
  try {
    const params = new URLSearchParams();
    if (filters.collection) params.append('collection', filters.collection);
    if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);

    const response = await axiosInstance.get(`/products?${params.toString()}`);
    const data = response.data;
    return Array.isArray(data) ? data.map(normalizeProduct) : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function fetchProductByIdOrSlug(idOrSlug) {
  try {
    const response = await axiosInstance.get(`/products/${idOrSlug}`);
    return normalizeProduct(response.data);
  } catch (error) {
    console.error(`Failed to fetch product ${idOrSlug}:`, error);
    throw error;
  }
}
