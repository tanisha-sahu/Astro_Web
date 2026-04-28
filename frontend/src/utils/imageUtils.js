import { IMAGE_BASE_URL } from '../api/axiosInstance';

/**
 * Returns the full URL for an image path.
 * Handles external URLs, local uploads, and placeholders.
 * @param {string} path - The image path or URL.
 * @returns {string} - The full image URL.
 */
export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) return `${IMAGE_BASE_URL}${path}`;
    return path;
};
