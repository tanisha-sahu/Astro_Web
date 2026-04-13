import PRODUCT_CATEGORIES from '../data/productCategoriesData.js'

// Simulated loader: replace this with a real backend API call later.
export async function fetchProductCategories() {
  // In future: return fetch('/api/categories').then(r => r.json())
  return Promise.resolve(PRODUCT_CATEGORIES)
}

