const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const BACKEND_URL = BASE_URL.split('/api/v1')[0];

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${BACKEND_URL}${path}`;
  return path;
};

export async function fetchSanataniLifeCategories() {
  const response = await fetch(`${BASE_URL}/collections`);
  if (!response.ok) throw new Error('Failed to fetch collections');
  const data = await response.json();
  
  // Map fields to match the UI expectations (id, title, description, image)
  return data.map(c => ({
    id: c.slug || c._id,
    title: c.name,
    description: c.description,
    image: getImageUrl(c.image),
    colors: ['#d62828', '#fcbf49'] // Default colors for placeholders
  }));
}

