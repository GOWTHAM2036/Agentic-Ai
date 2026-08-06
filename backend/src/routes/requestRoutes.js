const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { validateCreateRequest } = require('../validators/requestValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, validateCreateRequest, requestController.createRequest);
router.get('/', authMiddleware, requestController.getAllRequests);
router.get('/:id', authMiddleware, requestController.getRequestById);
router.get('/:id/logs', authMiddleware, requestController.getRequestLogs);

module.exports = router;
