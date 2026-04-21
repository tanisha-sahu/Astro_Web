import axiosInstance, { IMAGE_BASE_URL } from './axiosInstance';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
  return path;
};

const normalizeCategory = (c) => ({
  ...c,
  image: getImageUrl(c.image)
});

export async function fetchProductCategories() {
  try {
    const response = await axiosInstance.get('/collections');
    const data = response.data;
    return Array.isArray(data) ? data.map(normalizeCategory) : [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}

export async function fetchCollectionByIdOrSlug(idOrSlug) {
  try {
    const response = await axiosInstance.get(`/collections/${idOrSlug}`);
    return normalizeCategory(response.data);
  } catch (error) {
    console.error(`Failed to fetch collection ${idOrSlug}:`, error);
    throw error;
  }
}
