const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');
const { protect } = require('../../middlewares/authMiddleware');

router.use(protect);

router.get('/', notificationController.getMyNotifications);
router.post('/', notificationController.createNotification);
router.patch('/mark-all-read', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
