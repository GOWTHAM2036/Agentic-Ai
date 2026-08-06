const reportService = require('../services/reportService');
const { sendSuccess } = require('../utils/responseHandler');

async function getAnalytics(req, res, next) {
  try {
    const analytics = await reportService.getAnalyticsOverview();
    return sendSuccess(res, 'System analytics overview retrieved', analytics);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalytics
};
