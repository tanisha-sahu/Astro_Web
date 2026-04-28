import { 
    getBlogsApi, 
    getBlogByIdApi, 
    getMyBlogsApi, 
    getAdminBlogsApi, 
    createBlogApi, 
    updateBlogApi, 
    deleteBlogApi 
} from '../api/blogs';
import { IMAGE_BASE_URL } from '../api/axiosInstance';

export const normalizeBlog = (b) => {
    if (!b) return null;
    
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
        return path;
    };

    return {
        ...b,
        id: b.slug || b._id,
        image: getImageUrl(b.image),
        authorName: b.author ? `${b.author.firstName} ${b.author.lastName}` : 'Anonymous'
    };
};

const blogService = {
    fetchBlogs: async (filters = {}) => {
        try {
            const data = await getBlogsApi(filters);
            const blogsArray = Array.isArray(data) ? data : (data.blogs || []);
            return blogsArray.map(normalizeBlog);
        } catch (error) {
            console.error('Failed to fetch blogs in service:', error);
            return [];
        }
    },

    fetchBlogByIdOrSlug: async (idOrSlug) => {
        try {
            const data = await getBlogByIdApi(idOrSlug);
            return normalizeBlog(data);
        } catch (error) {
            console.error(`Failed to fetch blog ${idOrSlug} in service:`, error);
            throw error;
        }
    },

    fetchMyBlogs: async () => {
        try {
            const data = await getMyBlogsApi();
            return Array.isArray(data) ? data.map(normalizeBlog) : [];
        } catch (error) {
            console.error('Failed to fetch my blogs in service:', error);
            return [];
        }
    },

    fetchAdminBlogs: async () => {
        try {
            const data = await getAdminBlogsApi();
            return Array.isArray(data) ? data.map(normalizeBlog) : [];
        } catch (error) {
            console.error('Failed to fetch admin blogs in service:', error);
            return [];
        }
    },

    createBlog: async (blogData) => {
        try {
            const data = await createBlogApi(blogData);
            return normalizeBlog(data);
        } catch (error) {
            console.error('Failed to create blog in service:', error);
            throw error;
        }
    },

    updateBlog: async (id, blogData) => {
        try {
            const data = await updateBlogApi(id, blogData);
            return normalizeBlog(data);
        } catch (error) {
            console.error('Failed to update blog in service:', error);
            throw error;
        }
    },

    deleteBlog: async (id) => {
        try {
            return await deleteBlogApi(id);
        } catch (error) {
            console.error('Failed to delete blog in service:', error);
            throw error;
        }
    }
};

export default blogService;
