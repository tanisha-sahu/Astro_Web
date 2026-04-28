import { 
    getMyNotificationsApi, 
    markNotificationReadApi, 
    markAllNotificationsReadApi,
    createNotificationApi 
} from '../api/notification';

const notificationService = {
    fetchMyNotifications: async () => {
        return await getMyNotificationsApi();
    },

    markAsRead: async (id) => {
        return await markNotificationReadApi(id);
    },

    markAllAsRead: async () => {
        return await markAllNotificationsReadApi();
    },

    createNotification: async (data) => {
        return await createNotificationApi(data);
    }
};

export default notificationService;
