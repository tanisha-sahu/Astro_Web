const express = require('express');
const { protect, authorizeRoles } = require('../../middlewares/authMiddleware');
const collectionController = require('../../controllers/collectionController');
const ROLES = require('../../config/roles');

const router = express.Router();

router.get('/', collectionController.getCollections);
router.get('/:idOrSlug', collectionController.getCollection);

router.post('/', protect, authorizeRoles(ROLES.ADMIN), collectionController.createCollection);

router.put('/:id', protect, authorizeRoles(ROLES.ADMIN), collectionController.updateCollection);

router.delete('/:id', protect, authorizeRoles(ROLES.ADMIN), collectionController.deleteCollection);

module.exports = router;
