import { getProductsApi, getProductByIdApi, createProductApi, updateProductApi, deleteProductApi, toggleProductStatusApi } from '../api/products';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

export const normalizeImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
  return path;
};

export const normalizeProduct = (p) => {
  if (!p) return null;
  
  // Normalize specifications: Handle both Array of {label, value} and flat Object
  let specs = [];
  if (Array.isArray(p.specifications) && p.specifications.length > 0) {
    specs = p.specifications;
  } else if (p.specifications && typeof p.specifications === 'object') {
    // Filter out internal Mongoose keys if any
    specs = Object.entries(p.specifications)
      .filter(([key]) => !key.startsWith('_') && key !== '$__')
      .map(([label, value]) => ({ 
        label: label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1'), 
        value: String(value)
      }));
  }

  // Normalize careInstructions: Handle both Array of Strings and single String
  let care = [];
  if (Array.isArray(p.careInstructions)) {
    care = p.careInstructions;
  } else if (p.careInstructions && typeof p.careInstructions === 'string') {
    care = [p.careInstructions];
  }

  return {
    ...p,
    id: p.slug || p._id,
    price: p.sellingPrice,
    oldPrice: p.mrp,
    img: normalizeImageUrl(p.image),
    category: p.collection?.name || '',
    categoryId: p.collection?._id || p.collection || '',
    specifications: specs,
    careInstructions: care
  };
};

const productService = {
    fetchProducts: async (filters = {}) => {
        try {
            const data = await getProductsApi(filters);
            
            // If it's an admin request or has pagination, return the whole object but keep products normalized
            if (data.products && Array.isArray(data.products) && filters.admin) {
                return {
                    ...data,
                    products: data.products.map(normalizeProduct)
                };
            }

            const productsArray = Array.isArray(data) ? data : (data.products || []);
            return productsArray.map(normalizeProduct);
        } catch (error) {
            console.error('Failed to fetch products in service:', error);
            return [];
        }
    },


    
    fetchProductByIdOrSlug: async (idOrSlug) => {
        try {
            const data = await getProductByIdApi(idOrSlug);
            return normalizeProduct(data);
        } catch (error) {
            console.error(`Failed to fetch product ${idOrSlug} in service:`, error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            const data = await createProductApi(productData);
            return normalizeProduct(data);
        } catch (error) {
            console.error('Failed to create product in service:', error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            const data = await updateProductApi(id, productData);
            return normalizeProduct(data);
        } catch (error) {
            console.error('Failed to update product in service:', error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            return await deleteProductApi(id);
        } catch (error) {
            console.error('Failed to delete product in service:', error);
            throw error;
        }
    },

    toggleStatus: async (id) => {
        try {
            return await toggleProductStatusApi(id);
        } catch (error) {
            console.error('Failed to toggle product status in service:', error);
            throw error;
        }
    }
};



export default productService;
