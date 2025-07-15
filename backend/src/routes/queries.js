const express = require('express');
const router = express.Router();
const { 
  processQuery, 
  getQueryHistory, 
  getQueryById, 
  submitFeedback 
} = require('../controllers/queryController');

// Process a new query
router.post('/process', processQuery);

// Get query history with pagination
router.get('/history', getQueryHistory);

// Get specific query by ID
router.get('/:id', getQueryById);

// Submit feedback for a query
router.post('/:id/feedback', submitFeedback);

module.exports = router;