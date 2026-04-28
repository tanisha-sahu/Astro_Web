import { 
    getProductCategoriesApi, 
    getCollectionByIdApi, 
    getCollectionsApi, 
    deleteCollectionApi, 
    toggleCollectionStatusApi,
    createCollectionApi,
    updateCollectionApi
} from '../api/productCategories';
import { getSanataniLifeCategoriesApi } from '../api/sanataniLifeCategories';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

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

const categoryService = {
    fetchCollectionByIdOrSlug: async (idOrSlug) => {
        try {
            return await getCollectionByIdApi(idOrSlug);
        } catch (error) {
            console.error(`Failed to fetch collection ${idOrSlug} in service:`, error);
            throw error;
        }
    },

    fetchProductCategories: async () => {

        try {
            const data = await getProductCategoriesApi();
            const collectionsArray = Array.isArray(data) ? data : (data.collections || []);
            return collectionsArray.map(normalizeCategory);
        } catch (error) {
            console.error('Failed to fetch product categories in service:', error);
            return [];
        }
    },

    fetchCollectionByIdOrSlug: async (idOrSlug) => {
        try {
            const data = await getCollectionByIdApi(idOrSlug);
            return normalizeCategory(data);
        } catch (error) {
            console.error(`Failed to fetch collection ${idOrSlug} in service:`, error);
            throw error;
        }
    },

    fetchSanataniLifeCategories: async () => {
        try {
            const data = await getSanataniLifeCategoriesApi();
            const collectionsArray = Array.isArray(data) ? data : (data.collections || []);
            
            return collectionsArray.map(c => ({
                id: c.slug || c._id,
                title: c.name,
                description: c.description,
                image: getImageUrl(c.image),
                colors: ['#d62828', '#fcbf49']
            }));
        } catch (error) {
            console.error('Failed to fetch sanatani life categories in service:', error);
            return [];
        }
    },

    fetchCollections: async (params = {}) => {
        try {
            const data = await getCollectionsApi(params);
            return data; // Return raw data for admin pagination
        } catch (error) {
            console.error('Failed to fetch collections in service:', error);
            throw error;
        }
    },

    deleteCollection: async (id) => {
        try {
            return await deleteCollectionApi(id);
        } catch (error) {
            console.error('Failed to delete collection in service:', error);
            throw error;
        }
    },

    toggleStatus: async (id) => {
        try {
            return await toggleCollectionStatusApi(id);
        } catch (error) {
            console.error('Failed to toggle collection status in service:', error);
            throw error;
        }
    },

    createCollection: async (collectionData) => {
        try {
            return await createCollectionApi(collectionData);
        } catch (error) {
            console.error('Failed to create collection in service:', error);
            throw error;
        }
    },

    updateCollection: async (id, collectionData) => {
        try {
            return await updateCollectionApi(id, collectionData);
        } catch (error) {
            console.error('Failed to update collection in service:', error);
            throw error;
        }
    }
};



export default categoryService;
