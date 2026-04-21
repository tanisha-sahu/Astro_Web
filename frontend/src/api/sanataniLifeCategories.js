import axiosInstance, { IMAGE_BASE_URL } from './axiosInstance';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
  return path;
};

export async function fetchSanataniLifeCategories() {
  try {
    const response = await axiosInstance.get('/collections');
    const data = response.data;
    
    // Map fields to match the UI expectations (id, title, description, image)
    return data.map(c => ({
      id: c.slug || c._id,
      title: c.name,
      description: c.description,
      image: getImageUrl(c.image),
      colors: ['#d62828', '#fcbf49'] // Default colors for placeholders
    }));
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}
