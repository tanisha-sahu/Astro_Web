import { loginApi, registerApi, logoutApi, getProfileApi, updateProfileApi, deleteProfileApi, changePasswordApi } from '../api/auth';

const authService = {
    register: async (userData) => {
        return await registerApi(userData);
    },
    login: async (credentials) => {
        return await loginApi(credentials);
    },
    logout: async () => {
        return await logoutApi();
    },
    getProfile: async () => {
        return await getProfileApi();
    },
    updateProfile: async (userData) => {
        return await updateProfileApi(userData);
    },
    deleteProfile: async () => {
        return await deleteProfileApi();
    },
    changePassword: async (passwords) => {
        return await changePasswordApi(passwords);
    }
};

export default authService;

