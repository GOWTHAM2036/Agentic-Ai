const reportService = require('../services/reportService');
const { sendSuccess } = require('../utils/responseHandler');

async function getReportByRequestId(req, res, next) {
  try {
    const report = await reportService.getReportByRequestId(req.params.requestId);
    return sendSuccess(res, 'Report retrieved successfully', report);
  } catch (err) {
    next(err);
  }
}

async function getAllReports(req, res, next) {
  try {
    const reports = await reportService.getAllReports();
    return sendSuccess(res, 'Reports list retrieved successfully', reports);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReportByRequestId,
  getAllReports
};
