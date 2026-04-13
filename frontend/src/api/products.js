import { PRODUCTS } from '../data/productsData.js'

// Backend-ready loader for product gallery.
export async function fetchProducts() {
  return Promise.resolve(PRODUCTS)
}

