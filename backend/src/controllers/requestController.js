const requestService = require('../services/requestService');
const { sendSuccess } = require('../utils/responseHandler');

async function createRequest(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null;
    const request = await requestService.createBusinessRequest(userId, req.body);
    return sendSuccess(res, 'Business request submitted and autonomous agents dispatched', request, 201);
  } catch (err) {
    next(err);
  }
}

async function getAllRequests(req, res, next) {
  try {
    const requests = await requestService.getAllBusinessRequests();
    return sendSuccess(res, 'Business requests retrieved successfully', requests);
  } catch (err) {
    next(err);
  }
}

async function getRequestById(req, res, next) {
  try {
    const request = await requestService.getBusinessRequestById(req.params.id);
    return sendSuccess(res, 'Business request details retrieved', request);
  } catch (err) {
    next(err);
  }
}

async function getRequestLogs(req, res, next) {
  try {
    const logs = await requestService.getRequestLogs(req.params.id);
    return sendSuccess(res, 'Agent execution logs retrieved', logs);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  getRequestLogs
};
