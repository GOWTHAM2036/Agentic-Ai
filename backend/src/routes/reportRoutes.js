const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, reportController.getAllReports);
router.get('/:requestId', authMiddleware, reportController.getReportByRequestId);

module.exports = router;
